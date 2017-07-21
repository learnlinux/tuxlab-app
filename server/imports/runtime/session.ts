/*
* TuxLab Session Class
* Uppermost controller class for a Lab.
* @author: Derek Brown, Cem Ersoz
*/

/* IMPORTS */
import { Config } from '../service/config';
import { Cache } from '../service/cache';
import { etcd } from '../service/etcd';

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
  session_id : string,
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
  protected static _TTL = Config.get('session_idle_timeout');

  // Session
  public session_id : string;
  public expires : number;
  public status : SessionStatus = SessionStatus.active;
  private static constructSessionID(user_id : string, lab_id : string){
    return user_id + '/' + lab_id;
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
  private getDefaultContainer(){
    return this.containers[0];
  }

/************************
 *     CONSTRUCTOR      *
 ************************/

  constructor (obj : SessionObj){
    // Construct Cache
    super();

    // Copy Values
    _.extend(this, obj);

    // Set Expiration
    this.expires = Date.now() + Config.get('session_idle_timeout');
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
           return Session.getSession_mongo(session_id, user_id); // Look in MongoDB
         }
       })
     .then((val) => {
       if (typeof val === "object" && val instanceof Session) {
         return val;
       } else if (typeof lab_id === "undefined") {
         return undefined;
       } else {
         return Session.getSession_create(session_id,user_id,lab_id); // Create New
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

  private static getSession_mongo(session_id : string, user_id : string) : Promise <Session>{
    return new Promise((resolve, reject) => {
      let res = Sessions.findOne({ 'session_id' : session_id, 'status' : SessionStatus.active });

      if (!res){
        resolve(undefined);
      } else {
        // OBJECTS
        let lab : LabRuntime;

        // Get LabRuntime
        LabRuntime.getLabRuntime(res.lab_id)

        // Get VMConfig
        .then((lab : LabRuntime) => {
          lab = lab;
          return lab.getVMConfig();
        })
        .then((config : VMConfigCustom[]) => {
          let containers = _.map(config, (vm : VMConfigCustom, i : number) => {
              return new Container(vm, res.containers[i].container_id);
          });

          return new Session({
            session_id : session_id,
            user_id : user_id,
            lab_id : res.lab_id,
            lab : lab,
            containers : containers
          });
        });
      }
    });
  }

  private static getSession_create(session_id : string, user_id : string, lab_id : string) : Promise <Session>{
      //OBJECTS
      let lab : LabRuntime;
      let containers : Container[];

      // Get LabRuntime
      return LabRuntime.getLabRuntime(lab_id)
      
      .then((lab : LabRuntime) => {
        lab = lab;
      })

      // Get VMConfig from Runtime
      .then(() => {
        return lab.getVMConfig()
      })

      // Create Containers
      .then((vm : VMConfigCustom[]) => {
        containers = _.map(vm, (config) => {
            return new Container(config);
        });
      })


      // Create Session Object
      .then(() => {
        return new Session({
          session_id : session_id,
          user_id : user_id,
          lab_id : lab_id,
          lab : lab,
          containers : containers
        });
      })

      // Initialize Container
      .then((session) => {
        return session.initLab()
        .then(() => session);
      })

      // Create Session Records
      .then((session : Session) => {
        return Promise.all(
          [
           session.etcd_create_proxy(),
           session.etcd_create_dns(),
           session.cache_add(),
           session.mongo_add()
         ]).then(function(){
           return session;
         })
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
      return Session._cache.set(this.session_id, this);
    });
  }

  private cache_del() : Promise<{}>{
    return new Promise((resolve, reject) => {
      return Session._cache.del(this.session_id);
    });
  }

  private cache_renew() : Promise<{}>{
    return new Promise((resolve, reject) => {
      return Session._cache.ttl(this.session_id, Session._TTL);
    });
  }

  private mongo_add() : Promise<{}>{
    return new Promise((resolve, reject) => {

      let container_obj : ContainerModel[] =
        _.map(this.containers, (container : Container) => {
          return {
            node_ip : container.node_ip,
            container_id : container.container_id,
            container_pass : container.container_pass
          };
        });

      let record : SessionModel = {
        session_id : this.session_id,
        user_id : this.user_id,
        lab_id : this.lab_id,
        status: SessionStatus.active,
        expires: this.expires,
        current_task : this.current_task,
        containers : container_obj
      }

      Sessions.insert(record,(err) => {
        if (err){
          reject(err);
        } else {
          resolve();
        }
      })
    });
  }

  private mongo_update_task() : Promise<{}>{
    return new Promise((resolve, reject) => {
      Sessions.update(
        { 'session_id' : this.session_id,
          'user_id' : this.user_id,
          'lab_id' : this.lab_id,
          'status' : SessionStatus.active
        }, {
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
        { 'session_id' : this.session_id,
          'user_id' : this.user_id,
          'lab_id' : this.lab_id,
          'status' : SessionStatus.active
        }, {
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
  private static etcd_getKeyProxy(session : Session) : string{
    return '/redrouter/SSH::'+session.getUserObj()._id;
  }

  private static etcd_getKeyDNS(session : Session) : string {
    return '/skydns/' + Config.get('ssh_dns_root')
                               .split('.')
                               .reverse()
                               .push(session.session_id)
                               .join('/');
  }


  private etcd_create_proxy() : Promise<{}> {
    return new Promise((resolve, reject) => {
      let record = {
        docker_container: this.getDefaultContainer().container_id,
        port: this.getDefaultContainer().config.ssh_port,
        username: this.session_id,
        allowed_auth: ["password"]
      };

      etcd.set(Session.etcd_getKeyProxy(this), record, {
        prevExist: false // Verify that this creation is unique
      }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private etcd_create_dns () : Promise<{}> {
    return new Promise((resolve, reject) => {
      let record = {
        host: this.getDefaultContainer().node_ip
      };

      etcd.set(Session.etcd_getKeyDNS(this), record, {
        prevExist: false // Verify that this creation is unique
      }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private etcd_renew_proxy = this.etcd_create_proxy;

  private etcd_renew_dns = this.etcd_create_dns;

  private etcd_delete_proxy() : Promise<{}> {
    return new Promise((resolve, reject) => {
      etcd.del(Session.etcd_getKeyProxy(this), {}, (err) => {
        if(err){
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private etcd_delete_dns() : Promise<{}> {
    return new Promise((resolve, reject) => {
      etcd.del(Session.etcd_getKeyDNS(this),{}, (err, res) => {
        if(err){
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

/************************
*  ENVIRONMENT OBJECT  *
************************/
  private getEnvironmentObject(){
    return {
      vm: _.map(this.containers, (container) => {
        container.getVMInterface();
      }),
      error: () => {},
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

  private getInitObject(success, failure) : InitObject{
    return new InitObject(_.extend(this.getEnvironmentObject(),
    {
      success: success,
      failure: failure
    }));
  }

  private getSetupObject(success, failure) : SetupObject{
    return new SetupObject(_.extend(this.getEnvironmentObject(),
                                    this.getTaskObject(),
    {
      success: success,
      failure: failure
    }));
  }

  private getVerifyObject(completed, failed, retry) : VerifyObject {
    return new VerifyObject(_.extend(this.getEnvironmentObject(),
                                     this.getTaskObject(),
      {
      setGrade: (n : number, d : number) => {

      },
      completed: completed,
      failed: failed,
      retry: retry
    }));
  }

  /************************
  *    SESSION FUNCTIONS  *
  ************************/

  public renew() : void {

    // Update Expiration Time
    this.expires = Date.now() + Config.get('session_idle_timeout');

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
    });
  }

  private destroyLab() : Promise<{}> {
    return new Promise((resolve, reject) => {
      this.lab.exec_destroy(this.getInitObject(resolve, reject));
    });
  }

  public nextTask() : Promise<{}> {
    return new Promise((resolve, reject) => {

      /* FUNCTIONS PASSED INTO VERIFIER */
      let completed = function(){

        // Check if Lab Completed
        if (this.lab.tasks.length >= this.current_task + 1){

          // Complete Lab
          this.destroy(SessionStatus.completed);
          resolve();

        } else {

          // Proceed to Next Task
          this.current_task++;
          this.mongo_update_task();

          this.lab.exec_setup(this.current_task, this.getSetupObject(resolve, reject));
        }
      }

      let retry = function(){
        resolve();
      }

      let failed = function(){
        this.destroy(SessionStatus.failed);
        resolve();
      }

      return this.lab.exec_verify(this.current_task, this.getVerifyObject(completed, failed, retry));
    });
  }
}
