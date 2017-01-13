/*
 * TuxLab Container Class
 * A living, breathing Docker Container.  Configured using the VM API.
 * @author: Derek Brown, Cem Ersoz
 */

 import * as fs from 'fs';

 import { VM } from '../api/vm';
 import { VMConfig, VMConfigCustom, VMResolveConfig } from '../api/vmconfig';

 import { ConfigService } from '../services/config';
 import { ContainerCacheObj } from '../services/session';

/*
  Create Dockerode Instance
*/
 import { Readable } from 'stream';
 import * as Docker from '~dockerode/lib/docker';
 import * as DContainer from '~dockerode/lib/container';
 import * as DExec from '~dockerode/lib/exec';
 const docker = new Docker({
   protocol: 'https',
   host: ConfigService.get('swarm_node_ip'),
   port: ConfigService.get('swarm_node_port'),
   ca: fs.readFileSync(ConfigService.get('ssl_ca')),
   cert: fs.readFileSync(ConfigService.get('ssl_cert')),
   key: fs.readFileSync(ConfigService.get('ssl_key'))
 });

/*
  Container Class
*/
 export class Container implements VM {
    private _ready : Promise<Container>;

    // Container Objects
    public config : VMConfigCustom;

    // Container Details
    public container_id : string;
    public container_pass : string;
    public node_ip : string;

    constructor(cfg : VMConfig, id? : string){

      this.config = VMResolveConfig(cfg);

      let prepare_containers : Promise<any>;
      // Create Container
      if (typeof id === "undefined") {
        prepare_containers = new Promise((resolve, reject) => {

          // Get Config from VMConfig
          const dockerconfig = {
            'Image': this.config.image,
            'Cmd': this.config.cmd,
            'AttachStdin': false,
            'AttachStdout': false,
            'AttachStderr': false,
            'Tty': true,
            'OpenStdin': false,
            'StdinOnce': false
          };

          // Dockerode Create Container
          docker.createContainer(dockerconfig, (err, container) => {
            if (err) {
              reject(err);
            } else {
              this.container_id = container.id;
              resolve(container);
            }
          });

          // Dockerode Start Container
          }).then((container : DContainer) => {
             container.start((err, data) => {
               if (err) {
                 throw err;
               } else {
                 return;
               }
             });
        });
      } else if (typeof id === "string"){
        prepare_containers = new Promise((resolve, reject) => {
            this.container_id = id;
            resolve();
        });
      }

      this._ready = prepare_containers
         .then(() => {
           docker.getContainer(this.container_id).inspect((err, data : any) => {
             if (err){
               throw err;
             } else {
               this.node_ip = data.Node.IP;
             }
           })
        }).then(() => {
           return this.getPass();
        }).then((password : string) => {
           this.container_pass = password;
           return this;
      });
    }

    public ready() : Promise<{}> {
      return this._ready;
    }

    public destroy() : Promise<{}> {
      return this.ready().then(() => {
        return new Promise((resolve, reject) => {
          docker.getContainer(this.container_id).remove((err, data) => {
            if (err){
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });
    }

    public getVMInterface() : VM {
      return {
        shell : this.shell
      };
    }

    public getContainerCacheObj() : ContainerCacheObj {
      return {
        id: this.container_id,
        config: this.config
      };
    }

    public shell_stream(command) : Promise<Readable> {
      var _this = this;

      // Set Exec Options
      const exec_options : DContainer.ExecOptions = {
        AttachStdout: true,
        AttachStderr: true,
        Cmd: command.split(" ")
      }
      const start_options : DExec.StartOptions = {
        hijack: true,
        stdin: true
      }

      return this.ready().then(() => {
        return new Promise(function(resolve, reject){
          docker.getContainer(_this.container_id).exec(exec_options, (err, exec) => {
            if (err) {
              reject(err);
            } else {
              resolve(exec);
            }
          });
        });
      }).then((exec : DExec) => {
        return new Promise((resolve, reject) => {
          exec.start(start_options, (err, stream) => {
            if (err) {
              reject(err);
            } else {
              resolve(stream);
            }
          });
        });
      });
    }

    public shell(command) : Promise<[string, string]> {
      return this.shell_stream(command).then((stream : Readable) => {
        return new Promise<[string,string]>((resolve, reject) => {

          let header = null;
          let stdout = "", stderr = "";

          stream.on('readable', () => {
            header = header || stream.read(8);

            // Process Chunks
            while (null !== (header = stream.read(8))) {
              let type = header.readUInt8(0);
              let payload = stream.read(header.readUInt32BE(4));

              if (header !== null && type == 1) {
                stdout += payload;
              } else if (header !== null && type == 2) {
                stderr += payload;
              } else {
                resolve([stdout, stderr]);
              }
            }
          });

          stream.on('end',() => {
            resolve([stdout, stderr]);
          });

        });
      });
    }

    public getPass() : Promise<string> {
      return this.shell("cat "+this.config.password_path).then((data) => {
        let [stdout, stdin] = data;
        if (stdin === ""){
          return stdout;
        } else {
          throw stdin;
        }
      });
    }

 }
