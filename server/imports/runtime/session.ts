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

/* COLLECTIONS */
import { Users } from '../../../both/collections/user.collection';

import { Task } from '../../../both/models/lab.model';

import { Session as SessionModel, Container as ContainerModel, SessionStatus, SessionTask } from '../../../both/models/session.model';
import { Sessions } from '../../../both/collections/session.collection';

import { TaskStatus } from '../../../both/models/course_record.model';
import { CourseRecords } from '../../../both/collections/course_record.collection';

/* RUNTIME */
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
  course_id : string,
  lab_id : string,
  lab : LabRuntime,
  tasks : SessionTask[],
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

  // Course
  public course_id : string;

  // Lab
  private lab : LabRuntime;
  public lab_id : string;
  public current_task = 0;
  public tasks;

  // User
  public user_id; //user_id
  public getUserObj(){
    return Users.findOne( this.user_id );
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
  }

  /*
    getJSON()
    Gets this object as a JSON Object, safe for returning to the end user.
   */
   public getJSON() : SessionModel {
     return {
       _id : this._id,
       user_id : this.user_id,
       course_id : this.course_id,
       lab_id: this.lab_id,
       status: this.status,
       expires: this.expires,
       current_task : this.current_task,
       tasks : this.tasks,
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
      Session._cache.get<Session>(session_id, (err, val) => {
        if (err){
          reject(err);
        } else if (_.has(val,'status') && _.includes([SessionStatus.creating, SessionStatus.active],val.status)) {
          resolve(val);
        } else {
          resolve(null);
        }
      });
    });
  }

  private static getExpirationDate(){
    return new Date((new Date).getTime() + Meteor.settings['private']['labvm']['session_idle_timeout']);
  }

  private static getSession_mongo(user_id : string, lab_id : string) : Promise <Session>{
    return Sessions.rawCollection().findAndModify(
        {
          'user_id' : user_id ,
          'lab_id' : lab_id ,
          'status' : { $in : [SessionStatus.creating, SessionStatus.active] }
        },
        {},
        {
          $setOnInsert: {
            '_id' : (new Mongo.ObjectID()).valueOf(),
            'status' : SessionStatus.creating,
            'expires' : Session.getExpirationDate()
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
              course_id : session_record.course_id,
              lab_id : session_record.lab_id,
              lab : lab,
              tasks : session_record.tasks,
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

      // Set Service Aliases
      .then((containers) => {
        return _.map(containers, (container, index) => {
          container.proxy_username = session_id + '-' + index;
          container.container_dns = container.proxy_username + '.' + Meteor.settings['private']['domain']['ssh_dns_root'];
          return container;
        })
      })

      // Create Session Object
      .then((containers) => {
        session = new Session({
          _id : session_id,
          user_id : user_id,
          course_id : lab.course_id,
          lab_id : lab_id,
          lab : lab,
          containers : containers,
          tasks : _.map(lab.tasks, () => {
            return {
              feedback : ""
            };
          })
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
 public destroy(status : SessionStatus) : Promise<Session> {
   this.status = status;

   // Run Lab Destroy Function
   this.destroyLab();

   // Delete from Cache
   return Promise.all([
    this.mongo_update_session_status(status)
   ])

  .then(function(){
    return this.toJSON();
  })
 }

/************************
 *    SESSION RECORDS    *
 ************************/
 public getCacheID(){
   return Session.constructSessionID(this.user_id, this.lab_id);
 }

  private cache_add() : Promise<{}>{
    return new Promise((resolve, reject) => {
      return Session._cache.set(this.getCacheID(), this, (err, res) => {
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
      return Session._cache.del(this.getCacheID(), (err, res) => {
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
      return Session._cache.ttl(this.getCacheID(), Session._TTL, (err, res) => {
        if(err){
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  private mongo_add() : Promise<{}>{

    // Get Container Objects
    let container_obj : ContainerModel[] =
      _.map(this.containers, (container : Container) => {
        return container.getJSON();
      });

    // Create Session Object
    return new Promise((resolve, reject) => {
      let record : SessionModel = {
        // Details
        user_id : this.user_id,
        course_id : this.course_id,
        lab_id : this.lab_id,

        // Session Status
        status: SessionStatus.active,
        expires: this.expires,
        current_task : this.current_task,
        tasks : this.tasks,
        containers : container_obj
      }

      Sessions.update(this._id,{ '$set' : record },(err, res) => {
        if (err){
          log.debug("Session | Error creating session record", err);
          reject(err);
        } else {
          resolve();
        }
      })
    })

    // Create Course Record
    .then(() => {
      return new Promise((resolve, reject) => {

        CourseRecords.upsert({
          user_id : this.user_id,
          course_id : this.lab.course_id
        }, {
          $set : {
            ["labs."+this.lab_id+"."+this._id] : {
                data : {},
                tasks : _.map(this.tasks, (task, i) => {
                  if(i == 0){
                    return {
                      status : TaskStatus.in_progress
                    };
                  } else {
                    return {
                      status : TaskStatus.not_attempted
                    };
                  }
                })
            }
          }
        }, (err) => {
          if(err){
            log.debug("Session | Error creating course record", err);
            reject(err);
          } else {
            resolve()
          }
        })
      })
    })
  }

  private mongo_update_task() : Promise<{}>{
    return new Promise((resolve, reject) => {
      Sessions.update(this._id, {
          $set : {
            'current_task' : this.current_task,
          }
        }, (err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
    });
  };

  private mongo_update_session_status(status : SessionStatus) : Promise<{}>{
    return new Promise((resolve, reject) => {
      Sessions.update(this._id, {
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

  private mongo_update_task_status(task_status : TaskStatus) : void {
    var session_key = "labs." + this.lab_id + "." + this._id + ".";

    CourseRecords.update({
      "user_id" : this.user_id,
      "course_id" : this.lab.course_id
    }, {
      $set : { [ session_key + "tasks." + this.current_task + ".status" ] : task_status }
    }, () => {

    });
  };

/************************
 *     ETCD RECORDS     *
 ************************/
  private static etcd_getKeyProxy(container : Container) : string{
    return '/redrouter/SSH::'+container.proxy_username;
  }

  private static etcd_getKeyDNS(container : Container) : string {
    return '/skydns/' + container.container_dns.split('.').reverse().join('/');
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
  private getEnvironmentObject() {
    var session_key = "labs." + this.lab_id + "." + this._id + ".";

    return {
      vm: _.map(this.containers, (container) => {
        return container.getVMInterface();
      }),
      setLabData: (data) => {
        return new Promise((resolve, reject) => {
          CourseRecords.update({
            "user_id" : this.user_id,
            "course_id" : this.lab.course_id
          }, {
            $set : {
              [session_key + "data"] : data
            }
          }, () => {
            resolve();
          });
        })
      },
      getLabData: () => {
        return new Promise((resolve, reject) => {
          resolve(CourseRecords.findOne({
              "user_id" : this.user_id,
              "course_id" : this.lab.course_id
            })["labs"][this.lab_id][this._id].data);
        })
      },
      getUserProfile: () => {
        return Users.findOne(this.user_id).profile;
      }
    };
  }

  private getTaskObject(){
    var session_key = "labs." + this.lab_id + "." + this._id + ".";

    return {
      setTaskData: (data : string) => {
        return new Promise((resolve, reject) => {
          CourseRecords.update({
            "user_id" : this.user_id,
            "course_id" : this.lab.course_id
          }, {
            $set : {
              [ session_key + "tasks." + this.current_task + ".data" ] : data
            }
          }, () => {
            resolve();
          });
        });
      },

      getTaskData: () => {
        return new Promise((resolve, reject) => {
          resolve(CourseRecords.findOne({
            "user_id" : this.user_id,
            "course_id" : this.lab.course_id
          })["labs"][this.lab_id][this._id].tasks[this.current_task].data);
        })
      },

      setFeedback: (md : string) => {
        return new Promise((resolve, reject) => {
          this.tasks[this.current_task].feedback = md;

          // Update in Sessions
          Sessions.update(this._id , {
            $set : {
              ["tasks." + this.current_task + ".feedback"] : md
            }
          }, () => {
            resolve();
          })
        })
      }
    };
  }

  private getInitObject(next, error) : InitObject{
    return new InitObject(_.assignIn(this.getEnvironmentObject(),
    {
      next: next,
      error: error
    }));
  }

  private getSetupObject(next, error) : SetupObject{
    return new SetupObject(_.assignIn(this.getEnvironmentObject(),
                                      this.getTaskObject(),
    {
      next: next,
      error: error
    }));
  }

  private getVerifyObject(error, next, fail, retry) : VerifyObject {
    return new VerifyObject(_.assignIn(this.getEnvironmentObject(),
                                       this.getTaskObject(),
      {
        setGrade: (n : number, d : number) => {
          return new Promise((resolve, reject) => {
            var session_key = "labs." + this.lab_id + "." + this._id + ".";

            CourseRecords.update({
              "user_id" : this.user_id,
              "course_id" : this.lab.course_id
            }, {
              [ session_key + "tasks." + this.current_task + ".grade" ] : [n,d]
            }, () => {
              resolve();
            });
          })
        },

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
    this.mongo_update_session_status(SessionStatus.active);
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
      let next_task_fn = this.getSetupObject(resolve, reject);

      let error = (err) => {
        reject(err);
      }

      let completed = () => {
        this.mongo_update_task_status(TaskStatus.success);

        // Check if Lab Completed
        if (this.lab.tasks.length <= this.current_task + 1){
          // Complete Lab
          this.destroy(SessionStatus.completed);
          resolve();
        } else {
          // Proceed to Next Task
          this.current_task++;
          this.mongo_update_task();
          this.lab.exec_setup(this.current_task, next_task_fn)
          this.mongo_update_task_status(TaskStatus.in_progress);
        }
      }

      let retry = () => {
        resolve(this);
      }

      let fail = () => {
        this.destroy(SessionStatus.failed);
        this.mongo_update_task_status(TaskStatus.failure);
        resolve();
      }

      return this.lab.exec_verify(this.current_task, this.getVerifyObject(error, completed, fail, retry));
    }).then(() => {
      return this;
    }).catch((err) => {
      this.mongo_update_task_status(TaskStatus.error);
      return err;
    });
  }
}
