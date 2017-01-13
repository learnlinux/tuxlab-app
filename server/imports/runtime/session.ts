/*
* TuxLab Session Class
* Uppermost controller class for a Lab.
* @author: Derek Brown, Cem Ersoz
*/

/* IMPORTS */
import { Config } from '../config';
import { Cache } from '../cache';
import { etcd } from '../etcd';

import { Users } from '../../../both/collections/user.collection';
import { Task } from '../../../both/models/lab.model';
import { Session as SessionModel, Container as ContainerModel, SessionStatus } from '../../../both/models/session.model';
import { Sessions } from '../../../both/collections/session.collection';

import { VMConfigCustom } from '../api/vmconfig';
import { InitObject, SetupObject, VerifyObject } from '../api/environment';

import { Container } from './container';
import { LabRuntime } from './lab_runtime';

/*
  Instruction
  Interface for accessing markdown and labVM output.
*/
export interface Instruction {
  id: number;
  name: string;
  md: string;
}

/*
  Session Object
*/
export class Session extends Cache {
  // Cache
  protected static _TTL = Config.get('session_idle_timeout');

  // Session
  // session_id has to be time-unique; it is used for checking if the session
  // was already created.
  public session_id;
  private static constructSessionID(user_id : string){
    return user_id;
  }

  // Lab
  private lab : LabRuntime;
  public lab_id : string;
  public current_task = 0;
  public instructions : Instruction[];

  // User
  public user_id; //user_id
  public getUserObj(){
    return Users.findOne({ _id : this.user_id });
  }

  // Containers
  private containers : Container[];
  public getDefaultContainer(){
    return this.containers[0];
  }

/************************
 *     CONSTRUCTOR      *
 ************************/

  constructor (obj : SessionObj){
    // Construct Cache
    super();

    // Set Session ID.  Used for DNS Name and SSH Username.
    this.session_id = Session.constructSessionID(this.user_id);

    // Check if Session Exists.

    this.instructions = _.map(this.lab.tasks, function(task){
      let instruction = <Instruction>_.clone(task);
      return instruction;
    });
  }

  /*
    getSession
    Retrieves the session from the cache or mongodb if found.  If lab_id
    is supplied, it will try to create the session if it doesn't exist.
  */
  public static getSession(user_id : string, lab_id? : string) : Promise<Session>{
    let session_id = Session.constructSessionID(user_id);

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
          resolve(val);
        }
      });
    });
  }

  private static getSession_mongo(session_id : string, user_id : string) : Promise <Session>{
    return new Promise((resolve, reject) => {
      let res = Sessions.findOne({ 'session_id' : session_id, 'status' : 2 });

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

      // Initialize Containers
      .then(() => {
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

      // Create Session Records
      .then((session : Session) => {
        return Promise.all(
          [
           session.etcd_create_proxy(),
           session.etcd_create_dns(),
           session.cache_add(),
           session.mongo_add()
          ])
        .then(() => {
          return session;
        });
      })
  }

/************************
 *   DESTROY FUNCTION   *
 ************************/
 public destroy() : void {
   Promise.all(
     [
      this.cache_del(),
      this.mongo_update_status(SessionStatus.completed)
     ]);
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
            container_id : container.container_id
          };
        });

      let record : SessionModel = {
        session_id : this.session_id,
        user_id : this.user_id,
        lab_id : this.lab_id,
        status: SessionStatus.active,
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
          $set : { 'status' : status }
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

  private etcd_delete_proxy() : Promise<{}> {
    return new Promise((resolve, reject) => {
      etcd.del(Session.etcd_getKeyProxy(this), (err) => {
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
      etcd.del(Session.etcd_getKeyDNS(this), (err, res) => {
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

    // Renew in Object Cache
    this.cache_renew();

    //TODO: Renew ETCD Objects
  }

  private initLab() : Promise<{}> {

  }

  private destroyLab() : Promise<{}> {

  }

  public nextTask() : Promise<{}> {
    return new Promise((resolve, reject) => {

      this.current_task++;
      this.mongo_update_task(); // Updates current task in MongoDB.
      resolve();

    });
  }
}

/*
  SessionObj
  Elements needed to construct SessionObj; used internally.
*/
interface SessionObj{
  session_id : string,
  user_id : string,
  lab_id : string,
  lab : LabRuntime,
  containers : Container[]
}
