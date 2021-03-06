/*
 * TuxLab Container Class
 * A living, breathing Docker Container.  Configured using the VM API.
 * @author: Derek Brown, Cem Ersoz
 */

 import * as fs from 'fs';
 import * as _ from 'lodash';

 import { Container as ContainerModel } from '../../../both/models/session.model';

 import { VM } from '../api/vm';
 import { VMConfig, VMConfigCustom, VMResolveConfig } from '../api/vmconfig';

 import { log } from "../service/log";

/*
  Create Dockerode Instance
*/
 import { Readable, PassThrough } from 'stream';
 import * as Dockerode from 'dockerode';

/*
  Container Class
*/
 export class Container implements VM, ContainerModel {
    private _ready : Promise<Container>;

    // Dockerode Instance
    private static docker = new Dockerode({
      protocol:  Meteor.settings['private']['env']['swarm_node_proto'].toString(),
      host: Meteor.settings['private']['env']['swarm_node_ip'].toString(),
      port: Meteor.settings['private']['env']['swarm_node_port'].toString(),
      ca: (Meteor.settings['private']['env']['swarm_node_proto'] === "https") ? fs.readFileSync(Meteor.settings['private']['domain']['ssl_ca']).toString() : null,
      cert: (Meteor.settings['private']['env']['swarm_node_proto'] === "https") ? fs.readFileSync(Meteor.settings['private']['domain']['ssl_cert']).toString() : null,
      key: (Meteor.settings['private']['env']['swarm_node_proto'] === "https") ? fs.readFileSync(Meteor.settings['private']['domain']['ssl_key']).toString() : null
    });

    // Container Objects
    public config : VMConfigCustom;

    // Container Details
    private _container : Dockerode.Container;
    public container_id : string;
    public container_ip : string;
    public container_dns : string;
    public container_username : string;
    public container_pass : string;
    public proxy_username : string;

    constructor(cfg : VMConfig, id? : string){
      this.config = VMResolveConfig(cfg);
      this.container_username = this.config.username;

      let prepare_containers : Promise<Dockerode.Container>;

      // Create Container
      if (_.isNil(id)) {

        // Pull Image
        prepare_containers = Container.docker.pull(this.config.image, {})

        // Dockerode Create Container
        .then(() => {
          return Container.docker.createContainer({
            'Image': this.config.image,
            'Cmd': this.config.entry_cmd,
            'AttachStdin': false,
            'AttachStdout': false,
            'AttachStderr': false,
            'Tty': true,
            'OpenStdin': false,
            'StdinOnce': false,
            'HostConfig': {
              Memory : _.has(this, "config.host_config.Memory") ? this.config.host_config.Memory : 128 * 1024 * 1024 // Enforce Memory Limit,
              // DiskQuota: this.config.host_config.Disk || 1024 * 1024 * 1024 // Enforce Disk Limit
            }
          })
        })

        // Start Container
        .then(function(container : Dockerode.Container){
          return container.start();
        })

      } else if (typeof id === "string") {
        // Get Container
        prepare_containers = new Promise((resolve, reject) => {
          if (_.isNil(Container.docker.getContainer(id))){
            reject(new Meteor.Error("Could not find Docker Container."));
          } else {
            resolve(Container.docker.getContainer(id));
          }
        });
        
      } else {
        throw new Meteor.Error("Invalid id argument");
      }

      this._ready = prepare_containers

        // Get Container Object
        .then((container) => {
          this._container = container;
          return container.inspect();

        // Set Container IP and IP
        }).then((details) => {


          if(_.has(details, "Node.IP")){
            this.container_ip = (<any>details).Node.IP; //TOOD https://github.com/DefinitelyTyped/DefinitelyTyped/pull/18322

          } else if (_.has(details, "NetworkSettings.IPAddress")) {
            this.container_ip = details.NetworkSettings.IPAddress
          } else {

            throw "IP Address not set."
          }
          this.container_id = details.Id;

        // Get Password
        }).then(() => {
          return new Promise((resolve, reject) => {
            setTimeout(resolve, 500);
          }).then(() => {
            return this.getPass();
          }).then((pass : string) => {
            this.container_pass = pass;
          });

        // Return Self
        }).then(() => {
          return this;
        })
    }


    /*
      getJSON()
      Gets this object as a JSON Object, safe for returning to the end user.
     */
     public getJSON() : ContainerModel {
       return {
         name : this.config.name,
         container_ip : this.container_ip,
         container_dns : this.container_dns,
         container_id : this.container_id,
         container_username: this.container_username,
         container_pass: this.container_pass,
         proxy_username : this.proxy_username,
       }
     }

    public ready() : Promise<Container> {
      return this._ready;
    }

    public destroy() : Promise<{}> {
      return this.ready().then((container) => {
        return container._container.remove({ force: true });
      });
    }

    public static destroy(container_id : string) : Promise<{}> {
      var container = Container.docker.getContainer(container_id);
      return container.remove({ force: true });
    }

    public getVMInterface() : VM {
      return this;
    }

    public shell_stream(command : string | string[]) : Promise<{ stdout: Readable; stderr: Readable; }> {

      // Define Command
      if(typeof command === "string"){
        command = command.split(" ");
      }

      // Set Exec Options
      const exec_options = {
        AttachStdout: true,
        AttachStderr: true,
        Cmd: this.config.shell_fn(command)
      }

      const start_options = {
        hijack: true,
        stdin: false
      }

      // Create Exec Object
      return this._container.exec(exec_options)

      // Start Exec Object
      .then((exec : Dockerode.Exec) : Promise<any> => {
        return exec.start(start_options)
      })

      // Demux Streams
      .then((obj : any) : { stdout: Readable; stderr: Readable; } => {

        var stdout = new PassThrough();
        var stderr = new PassThrough();

        var stream = obj.output;
        this._container.modem.demuxStream(stream, stdout, stderr);

        stream.on('end', () => {
          stdout.emit('end');
          stderr.emit('end');
        })

        return {
          stdout : stdout,
          stderr : stderr
        };
      })
    }

    public shell(command : string | string[]) : Promise<{ stdout: string; stderr: string; }> {

      // Run Shell Stream
      return this.shell_stream(command)

      // Await Results
      .then(({stdout, stderr}) : Promise<{ stdout: string; stderr: string; }> => {

        return new Promise((resolve, reject) => {
          var stdout_chunks = [];
          var stderr_chunks = [];

          stdout.on("data", (content) => {
            stdout_chunks.push(content.toString());
          });
          stdout.on("error", (error) => {
            reject(error);
          })
          stderr.on("data", (content) => {
            stderr_chunks.push(content.toString());
          })
          stderr.on("error", (error) => {
            reject(error);
          })
          stdout.on("end", () => {
            resolve({
              stdout : stdout_chunks.join('').replace(/\n$/, ""),
              stderr : stderr_chunks.join('').replace(/\n$/, "")
            });
          })
        });
      });
    }

    public getPass() : Promise<string> {
      return this.shell(["cat",this.config.password_path]).then(({stdout, stderr}) => {
        if (stderr === ""){
          return stdout;
        } else {
          throw stderr;
        }
      });
    }
 }
