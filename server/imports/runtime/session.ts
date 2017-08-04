/*
* TuxLab Session Class
* Uppermost controller class for a Lab.
* @author: Derek Brown, Cem Ersoz
*/

/* IMPORTS */
import * as _ from "lodash";

import { Cache } from '../service/cache';
import { etcd } from '../service/etcd';
import { log } from '../service/log';

import { Users } from '../../../both/collections/user.collection';
import { Task } from '../../../both/models/lab.model';
import { Session as SessionModel, Container as ContainerModel, SessionStatus } from '../../../both/models/session.model';
import { Sessions } from '../../../both/collections/session.collection';

import { VMConfigCustom } from '../api/vmconfig';
import { InitObject, SetupObject, VerifyObject } from '../api/environment';

import { Container } from './container';
import { LabRuntime } from './lab_runtime';

/*
  SessionObj
  Elements needed to construct SessionObj.
*/
interface SessionObj{
  _id? : string,
  user_id : string,
  lab_id : string,
  lab : LabRuntime,
  containers : Container[]
}

/*
  Session Object
*/
export class Session extends Cache {
  // Cache
  protected static _TTL = Meteor.settings['private']['labvm']['session_idle_timeout'];

  // Session
  public _id : string;
  public expires : Date;
  public status : SessionStatus = SessionStatus.active;
  private static constructSessionID(user_id : string, lab_id : string){
    return user_id + '-' + lab_id;
  }

  // Lab
  private lab : LabRuntime;
  public lab_id : string;
  public current_task = 0;

  // User
  public user_id; //user_id
  public getUserObj(){
    return Users.findOne({ _id : this.user_id });
  }

  // Containers
  private containers : Container[];

/************************
 *     CONSTRUCTOR      *
 ************************/

  constructor (obj : SessionObj){
    // Construct Cache
    super();

    // Copy Values
    _.extend(this, obj);

    // Set Expiration
    this.expires = new Date();
    this.expires.setSeconds(this.expires.getSeconds() + Meteor.settings['private']['labvm']['session_idle_timeout']);
  }

  public getSessionID(){
    return Session.constructSessionID(this.user_id, this.lab_id);
  }

  /*
    getJSON()
    Gets this object as a JSON Object, safe for returning to the end user.
   */
   public getJSON() : SessionModel {
     return {
       _id : this._id,
       user_id : this.user_id,
       lab_id: this.lab_id,
       status: this.status,
       expires: this.expires,
       current_task : this.current_task,
       containers : _.map(this.containers, function(c : Container){
         return c.getJSON();
       })
     }
   }

  /*
    getSession
    Retrieves the session from the cache or mongodb if found.  If lab_id
    is supplied, it will try to create the session if it doesn't exist.
  */
  public static getSession(user_id : string, lab_id : string) : Promise<Session>{
    let session_id = Session.constructSessionID(user_id, lab_id);

    return Session.getSession_cache(session_id)// Look in Session Cache
      .then((val) => {
         if (typeof val === "object" && val instanceof Session) {
           return val;
         } else {
           return Session.getSession_mongo(user_id, lab_id); // Look in MongoDB
         }
       })
     .then((val) => {
       if (typeof val === "object" && val instanceof Session) {
         log.debug("Session | Retrieving from Cache");
         return val;
       } else {
         log.debug("Session | Creating New");
         return Session.getSession_create(val, user_id,lab_id); // Create New
       }
     })
  }

  private static getSession_cache(session_id : string) : Promise<Session>{
    return new Promise((resolve, reject) => {
      Session._cache.get(session_id, (err, val) => {
        if (err){
          reject(err);
        } else {
          resolve(<Session>val);
        }
      });
    });
  }

  private static getSession_mongo(user_id : string, lab_id : string) : Promise <Session>{

    return Sessions.rawCollection().findAndModify(
        {
          'user_id' : user_id,
          'lab_id' : lab_id,
          'status' : { $in : [SessionStatus.creating, SessionStatus.active] }
        },
        {},
        {
          $setOnInsert: {
            'status' : SessionStatus.creating
          }
        },
        {
          new: false,
          upsert: true
      })

    .then((res) => {
      return new Promise((resolve, reject) => {

        if (res.ok != 1) {
          return reject(new Error(res.err));

        } else if (!res.lastErrorObject.updatedExisting){
          return resolve(res.lastErrorObject.upserted);

        } else if (res.value.status) {
          return reject(new Error("Session in invalid state."));

        } else {

          var session_record : SessionModel = res.value;

          // Get LabRuntime
          let lab : LabRuntime;
          LabRuntime.getLabRuntime(session_record.lab_id)

          // Get VMConfig
          .then((lab : LabRuntime) => {
            lab = lab;
            return lab.getVMConfig();
          })

          .then((config : VMConfigCustom[]) => {
            let containers = _.map(config, (vm : VMConfigCustom, i : number) => {
                return new Container(vm, session_record.containers[i].container_id);
            });

            return new Session({
              _id : session_record._id,
              user_id : session_record.user_id,
              lab_id : session_record.lab_id,
              lab : lab,
              containers : containers
            });
          });
        }
      });
    });
  }

  private static getSession_create(session_id : string, user_id : string, lab_id : string) : Promise <Session>{
      var lab : LabRuntime;
      var session : Session;

      // Get LabRuntime
      return LabRuntime.getLabRuntime(lab_id)

      .then((res : LabRuntime) => {
        lab = res;
      })

      // Get VMConfig from Runtime
      .then(() => {
        return lab.getVMConfig()
      })

      // Create Containers
      .then((vm : VMConfigCustom[]) => {
        return Promise.all(_.map(vm, (config) => {
            return (new Container(config)).ready();
         }));
      })

      // Set Proxy Username
      .then((containers) => {
        return _.map(containers, (container, index) => {
          container.proxy_username = session_id + '-' + index;
          return container;
        })
      })

      // Create Session Object
      .then((containers) => {
        session = new Session({
          user_id : user_id,
          lab_id : lab_id,
          lab : lab,
          containers : containers
        });
      })

      // Initialize Container
      .then(() => {
        return session.initLab();
      })

      // Create Session Records
      .then(() => {
        return Promise.all(
          [
           session.mongo_add(),
           session.etcd_create_proxy(),
           session.etcd_create_dns(),
           session.cache_add()
         ]);
      })

      // Return Session
      .then(() => {
        return session;
      })
  }

/************************
 *   DESTROY FUNCTION   *
 ************************/
 public destroy(status : SessionStatus) : Promise<any> {
   this.status = status;

   // Run Lab Destroy Function
   this.destroyLab();

   return Promise.all(
     [
      this.cache_del(),
      this.mongo_update_status(status)
     ])
    .then(function(){
      return { status: SessionStatus.destroyed };
    })
 }

/************************
 *    SESSION RECORDS    *
 ************************/
  private cache_add() : Promise<{}>{
    return new Promise((resolve, reject) => {
      return Session._cache.set(this.getSessionID(), this, (err, res) => {
        if(err){
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  private cache_del() : Promise<{}>{
    return new Promise((resolve, reject) => {
      return Session._cache.del(this.getSessionID(), (err, res) => {
        if(err){
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  private cache_renew() : Promise<{}>{
    return new Promise((resolve, reject) => {
      return Session._cache.ttl(this.getSessionID(), Session._TTL, (err, res) => {
        if(err){
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  private mongo_add() : Promise<{}>{
    return new Promise((resolve, reject) => {

      let container_obj : ContainerModel[] =
        _.map(this.containers, (container : Container) => {
          return {
            container_ip : container.container_ip,
            container_id : container.container_id,
            proxy_username : container.proxy_username,
            container_username : container.container_username,
            container_pass : container.container_pass
          };
        });

      let record : SessionModel = {
        user_id : this.user_id,
        lab_id : this.lab_id,
        status: SessionStatus.active,
        expires: this.expires,
        current_task : this.current_task,
        containers : container_obj
      }

      Sessions.update({
        status: SessionStatus.creating,
        user_id : this.user_id,
        lab_id : this.lab_id
      },
      {
        '$set' : record
      },(err, res) => {
        if (err){
          log.debug("Session | Error creating session record", err);
          reject(err);
        } else {
          this._id = res;
          resolve();
        }
      })
    });
  }

  private mongo_update_task() : Promise<{}>{
    return new Promise((resolve, reject) => {
      Sessions.update(
        { '_id' : this._id }, {
          $set : { 'current_task' : this.current_task }
        }, (err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
    });
  };

  private mongo_update_status(status : SessionStatus) : Promise<{}>{
    return new Promise((resolve, reject) => {
      Sessions.update(
        { '_id' : this._id }, {
          $set : { 'status' : status, 'expires' : this.expires}
        }, (err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
    });
  }

/************************
 *     ETCD RECORDS     *
 ************************/
  private static etcd_getKeyProxy(container : Container) : string{
    return '/redrouter/SSH::'+container.proxy_username;
  }

  private static etcd_getKeyDNS(container : Container) : string {
    return '/skydns/' + Meteor.settings['private']['domain']['ssh_dns_root']
                              .split('.')
                              .reverse()
                              .concat([
                                 container.proxy_username
                              ])
                              .join('/');
  }


  private etcd_create_proxy() : Promise<{}> {
    return Promise.all(_.map(this.containers, (container, index) => {
      return new Promise((resolve, reject) => {
        let record = {
          port: container.config.ssh_port,
          username: container.config.username,
          docker_container: container.container_id,
          allowed_auth: ["password"]
        };

        etcd.set(Session.etcd_getKeyProxy(container), JSON.stringify(record), {
          prevExist: false // Verify that this creation is unique
        }, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }));
  }

  private etcd_create_dns () : Promise<{}> {
    return Promise.all(_.map(this.containers, (container, index) => {
      return new Promise((resolve, reject) => {
        let record = {
          host: container.container_ip
        };

        etcd.set(Session.etcd_getKeyDNS(container), JSON.stringify(record), {
          prevExist: false // Verify that this creation is unique
        }, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }));
  }

  private etcd_renew_proxy = this.etcd_create_proxy;

  private etcd_renew_dns = this.etcd_create_dns;

  private etcd_delete_proxy() : Promise<{}> {
    return Promise.all(_.map(this.containers, (container, index) => {
      return new Promise((resolve, reject) => {
        etcd.del(Session.etcd_getKeyProxy(container), {}, (err) => {
          if(err){
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }));
  }

  private etcd_delete_dns() : Promise<{}> {
    return Promise.all(_.map(this.containers, (container, index) => {
      return new Promise((resolve, reject) => {
        etcd.del(Session.etcd_getKeyDNS(container),{}, (err, res) => {
          if(err){
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }));
  }

/************************
*  ENVIRONMENT OBJECT  *
************************/
  private getEnvironmentObject(){
    return {
      vm: _.map(this.containers, (container) => {
        return container.getVMInterface();
      }),
      setLabData: () => {},
      getLabData: () => {},
      getUserProfile: () => {},
    };
  }

  private getTaskObject(){
    return {
      setTaskData: (data : string) => {},
      getTaskData: () => {},

      setMarkdown: (md : string) => {},
      setLog: (md : string) => {}
    };
  }

  private getInitObject(next, error) : InitObject{
    return new InitObject(_.extend(this.getEnvironmentObject(),
    {
      next: next,
      error: error
    }));
  }

  private getSetupObject(next, error) : SetupObject{
    return new SetupObject(_.extend(this.getEnvironmentObject(),
                                    this.getTaskObject(),
    {
      next: next,
      error: error
    }));
  }

  private getVerifyObject(error, next, fail, retry) : VerifyObject {
    return new VerifyObject(_.extend(this.getEnvironmentObject(),
                                     this.getTaskObject(),
      {
        setGrade: (n : number, d : number) => {},
        error: error,
        next: next,
        fail: fail,
        retry: retry
    }));
  }

  /************************
  *    SESSION FUNCTIONS  *
  ************************/

  public renew() : void {

    // Update Expiration Time
    this.expires = new Date();
    this.expires.setSeconds(this.expires.getSeconds() + Meteor.settings['private']['labvm']['session_idle_timeout']);

    // Renew in Object Cache
    this.cache_renew();

    // Renew ETCD Objects
    Promise.all([this.etcd_renew_proxy, this.etcd_renew_dns]);

    // Renew in MongoDB
    this.mongo_update_status(SessionStatus.active);
  }

  private initLab() : Promise<{}> {
    return new Promise((resolve, reject) => {
      this.lab.exec_init(this.getInitObject(resolve, reject));
    }).then(() => {
      return new Promise((resolve, reject) => {
        this.lab.exec_setup(this.current_task, this.getSetupObject(resolve, reject));
      })
    })
  }

  private destroyLab() : Promise<{}> {
    return new Promise((resolve, reject) => {
      this.lab.exec_destroy(this.getInitObject(resolve, reject));
    });
  }

  public nextTask() : Promise<Session> {
    return new Promise((resolve, reject) => {

      /* FUNCTIONS PASSED INTO VERIFIER */
      var self = this;
      let next_task_fn = this.getSetupObject(resolve, reject);

      let completed = () => {
        // Check if Lab Completed
        if (self.lab.tasks.length <= self.current_task + 1){
          // Complete Lab
          this.destroy(SessionStatus.completed);
          resolve();
        } else {
          // Proceed to Next Task
          self.current_task++;
          self.mongo_update_task();
          self.lab.exec_setup(self.current_task, next_task_fn);
        }
      }

      let retry = () => {
        resolve(this);
      }

      let fail = () => {
        self.destroy(SessionStatus.failed);
        resolve(this);
      }

      return this.lab.exec_verify(this.current_task, this.getVerifyObject(reject, completed, fail, retry));
    });
  }
}
