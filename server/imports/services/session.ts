
  /* GLOBAL IMPORTS */
  import * as fs from 'fs';
  import { ConfigService } from './config';

  /* ETCD IMPORTS */
  import { Etcd } from 'node-etcd';
  const etcd_conn_str =
    ConfigService.get('etcd_node_proto')+"://"+
    ConfigService.get('etcd_node_ip')+":"+
    ConfigService.get('etcd_node_port')
  const etcd = new Etcd(etcd_conn_str, {
    ca: fs.readFileSync(ConfigService.get('ssl_ca')),
    cert: fs.readFileSync(ConfigService.get('ssl_cert')),
    key: fs.readFileSync(ConfigService.get('ssl_key'))
  });

  /* SESSION CACHE IMPORTS */
  import { Cache } from './cache';
  import { LabRuntimeService } from './lab_runtime';

  import { VMConfigCustom } from '../api/vmconfig';

  import { LabRuntime } from '../runtime/lab_runtime';
  import { Container } from '../runtime/container';
  import { Session } from '../runtime/session';

  interface SessionCacheObj {

  }

/*
   SessionCache
*/
  class SessionCache extends Cache {

     constructor(TTL : number){
       super(TTL);
     }

   /************************
    *    SESSION METHODS   *
    ************************/
    private getSessionID(user_id : string){
      return user_id;
    }

    public createSession (user_id : string, lab : LabRuntime) : Promise<Session> {
       // Create Session_ID
       let session_id = this.getSessionID(user_id); // A user may have at most one active session;

       // Get VMConfig from Runtime
       return lab.getVMConfig()

       // Create Containers
       .then((vm : VMConfigCustom[]) => {
           return _.map(vm, (config) => {
               return new Container(config);
           });
       })

       // Create Session
       .then((containers : Container[]) => {
          return new Session(session_id, user_id, lab, containers );
       })

       // Initialize Containers
       .then((session : Session) => {
         //TODO Initialize containers
         return session;
       })

       // Create ETCD Records
       .then((session : Session) => {

         return Promise.all([this.etcd_create_proxy(session),
                             this.etcd_create_dns(session),
                             this.etcd_create_session(session)])
                       .then(() => {
                          return session;
                        });

       // Set Watcher for ETCD Records
       }).then((session : Session) => {
         session._onUpdate = this.etcd_update_session;
         return session;
       })

       // Store in Node-Cache
       .then((session) => {
          return new Promise((resolve, reject) => {
            this._cache.set(session.session_id, session, this._TTL, function(err){
              throw 'sessionCacheError';
            });
          });
       });
     }

    public getSession(user_id : string) : Promise<Session> {
      // Create Session_ID
      let session_id = user_id; // A user may have at most one active session;

      return new Promise((resolve, reject) => {

        // Check Cache
        this._cache.get(this.getKeySession(this.getSessionID(user_id)), (err, val) => {
           if (err) {
             reject(err);
           } else if (typeof val !== "undefined") {
             return val;
           } else {

             // Check ETCD
             etcd.get(this.getKeySession(this.getSessionID(user_id)), (err, val) => {
               if (err) {
                 reject(err);
               } else if (typeof val === "undefined") {

               } else {

               }
             });
           }
        })
      });
    }


  /************************
   *      ETCD OBJECT     *
   ************************/
    private getKeyProxy(session : Session) : string{
      return '/redrouter/SSH::'+session.getUserObj()._id;
    }

    private getKeyDNS(session : Session) : string {
      return '/skydns/' + ConfigService.get('ssh_dns_root')
                                       .split('.')
                                       .reverse()
                                       .push(session.session_id)
                                       .join('/');
    }

    private getKeySession(session_id : string) : string {
      return '/tuxlab/sessions/' + session_id;
    }

    private etcd_create_proxy (session : Session) : Promise<{}> {
      return new Promise((resolve, reject) => {
        let record = {
          docker_container: session.getDefaultContainer().container_id,
          port: session.getDefaultContainer().config.ssh_port,
          username: session.session_id,
          allowed_auth: ["password"]
        };

        etcd.set(this.getKeyProxy(session), record, {
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

    private etcd_create_dns (session : Session) : Promise<{}> {
      return new Promise((resolve, reject) => {
        let record = {
          host: session.getDefaultContainer().node_ip
        };

        etcd.set(this.getKeyDNS(session), record, {
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

    private etcd_create_session (session : Session) : Promise<{}> {
      return new Promise((resolve, reject) => {
        let record = {
            user_id: session.getUserObj()._id,
            lab_id: session.lab_id,
            current_task: 0
        };

        etcd.set(this.getKeySession(session.session_id), record, {}, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    private etcd_delete_proxy(session : Session) : Promise<{}> {
      return new Promise((resolve, reject) => {
        etcd.del(this.getKeyProxy(session), (err) => {
          if(err){
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    private etcd_delete_dns(session : Session) : Promise<{}> {
      return new Promise((resolve, reject) => {
        etcd.del(this.getKeyDNS(session), (err, res) => {
          if(err){
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    private etcd_delete_session(session : Session) : Promise<{}> {
      return new Promise((resolve, reject) => {
        etcd.del(this.getKeySession(session.session_id), (err, res) => {
          if(err){
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    private etcd_update_session = this.etcd_create_session;


  }
  export const SessionService = new SessionCache(ConfigService.get('session_idle_timeout'));
