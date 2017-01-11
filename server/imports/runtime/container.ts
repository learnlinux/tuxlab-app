/*
 * TuxLab Container Class
 * A living, breathing Docker Container.  Configured using the VM API.
 * @author: Derek Brown, Cem Ersoz
 */

 import * as fs from 'fs';
 import { Readable } from 'stream';

 import * as Docker from '~dockerode/lib/docker';
 import * as DContainer from '~dockerode/lib/container';
 import * as DExec from '~dockerode/lib/exec';

 import { ConfigService } from '../services/config.service';
 import { VMConfig, VMConfigCustom, VMResolveConfig } from '../api/vmconfig';

/*
  Create Dockerode Instance
*/
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
 export class Container {
    private _ready : Promise<Container>;

    // Container Objects
    private _config : VMConfigCustom;

    // Container Details
    public container_id : string;
    public container_pass : string;
    public node_ip : string;

    constructor(config : VMConfig){
      var _this = this;

      this._ready = new Promise((resolve, reject) => {

        // Get Config from VMConfig
        _this._config = VMResolveConfig(config);
        const docker_config = {
          'Image': _this._config.image,
          'Cmd': _this._config.cmd,
          'AttachStdin': false,
          'AttachStdout': false,
          'AttachStderr': false,
          'Tty': true,
          'OpenStdin': false,
          'StdinOnce': false
        };

        // Dockerode Create Container
        docker.createContainer(docker_config, (err, container) => {
          if (err) {
            reject(err);
          } else {
            _this.container_id = container.id;
            resolve(container);
          }
        });
      }).then((container : DContainer) => {
         container.start((err, data) => {
           if (err) {
             throw err;
           } else {
             return container;
           }
         });
      }).then(() => {
         docker.getContainer(_this.container_id).inspect((err, data) => {
           if (err){
             throw err;
           } else {
             _this.node_ip = data.Node.IP;
           }
         })
      }).then(() => {
         return _this.getPass();
      }).then((password : string) => {
         _this.container_pass = password;
         return _this;
      });
    }

    public destroy() : Promise<{}> {
      var _this = this;

      return new Promise((resolve, reject) => {
        docker.getContainer(_this.container_id).remove((err, data) => {
          if (err){
            reject(err);
          } else {
            resolve();
          }
        });
      });
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

      return new Promise((resolve, reject) => {
        docker.getContainer(_this.container_id).exec(exec_options, (err, exec) => {
          if (err) {
            reject(err);
          } else {
            resolve(exec);
          }
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
      return this.shell("cat "+this._config.password_path).then((data) => {
        let [stdout, stdin] = data;
        if (stdin === ""){
          return stdout;
        } else {
          throw stdin;
        }
      });
    }
 }
