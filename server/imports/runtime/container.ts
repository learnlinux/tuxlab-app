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
      protocol: 'https',
      host: Meteor.settings['env']['swarm_node_ip'].toString(),
      port: Meteor.settings['env']['swarm_node_port'].toString(),
      ca: fs.readFileSync(Meteor.settings['domain']['ssl_ca']).toString(),
      cert: fs.readFileSync(Meteor.settings['domain']['ssl_cert']).toString(),
      key: fs.readFileSync(Meteor.settings['domain']['ssl_key']).toString()
    });

    // Container Objects
    public config : VMConfigCustom;

    // Container Details
    private _container : Dockerode.Container;
    public container_id : string;
    public container_pass : string;
    public container_ip : string;

    constructor(cfg : VMConfig, id? : string){
      this.config = VMResolveConfig(cfg);

      let prepare_containers : Promise<Dockerode.Container>;

      // Create Container
      if (typeof id === "undefined") {

        // Dockerode Create Container
        prepare_containers = Container.docker.createContainer({
          'Image': this.config.image,
          'Cmd': this.config.cmd,
          'AttachStdin': false,
          'AttachStdout': false,
          'AttachStderr': false,
          'Tty': true,
          'OpenStdin': false,
          'StdinOnce': false
        })

        // Start Container
        .then(function(container : Dockerode.Container){
          return container.start();
        })

      } else if (typeof id === "string"){
        // Get Container
        prepare_containers= new Promise((resolve, reject) => {
          resolve(Container.docker.getContainer(id));
        });
      }

      var self = this;
      this._ready = prepare_containers

        // Get Container Object
        .then((container) => {
          self._container = container;
          return container.inspect();

        // Set Container IP and IP
        }).then((details) => {
          self.container_ip = (<any>details).Node.IP; //TOOD https://github.com/DefinitelyTyped/DefinitelyTyped/pull/18322
          self.container_id = details.Id;

        // Get Password
        }).then(() => {
          return self.getPass()
          .then(function(pass){
            self.container_pass = pass;
          });

        // Return Self
        }).then(() => {
          return self;
        })
    }

    /*
      getJSON()
      Gets this object as a JSON Object, safe for returning to the end user.
     */
     public getJSON() : ContainerModel {
       return {
         container_ip : this.container_ip,
         container_id : this.container_id,
         container_pass: this.container_pass
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

    public getVMInterface() : VM {
      return {
        shell : this.shell
      };
    }

    public shell_stream(command : string | string[]) : Promise<[Readable, Readable]> {

      // Define Command
      if(typeof command === "string"){
        command = command.split(" ");
      }

      // Set Exec Options
      const exec_options = {
        AttachStdout: true,
        AttachStderr: true,
        Cmd: command
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
      .then((obj : any) : [Readable,Readable] => {

        var stdout = new PassThrough();
        stdout.setEncoding('utf-8');
        var stderr = new PassThrough();
        stderr.setEncoding('utf-8');

        var stream = obj.output;
        var header = null;
        stream.on('readable', function() {
          header = header || stream.read(8);
          while (header !== null) {
            var type = header.readUInt8(0);
            var payload = stream.read(header.readUInt32BE(4));
            if (payload === null){
              break;
            } else if (type == 1) {
              stdout.write(payload);
            } else if (type == 2){
              stderr.write(payload);
            }
            header = stream.read(8);
          }
        });
        stream.on('end', function(){
          stdout.emit('end');
          stderr.emit('end');
        })

        return [stdout,stderr];
      })
    }

    public shell(command : string | string[]) : Promise<[string, string]> {

      // Run Shell Stream
      return this.shell_stream(command)

      // Await Results
      .then(([stdout, stderr] : [Readable, Readable]) : Promise<[string, string]> => {
        return new Promise((resolve, reject) => {
          var stdout_chunks = [];
          var stderr_chunks = [];

          stdout.on("data", (content) => {
            stdout_chunks.push(content);
          });
          stdout.on("error", (error) => {
            reject(error);
          })
          stderr.on("data", (content) => {
            stderr_chunks.push(content);
          })
          stderr.on("error", (error) => {
            reject(error);
          })
          stdout.on("end", () => {
            resolve([
              stdout_chunks.join('').replace(/\n$/, ""),
              stderr_chunks.join('').replace(/\n$/, "")
            ]);
          })
        });
      });
    }

    public getPass() : Promise<string> {
      return this.shell(["cat",this.config.password_path]).then(([stdout, stderr]) => {

        if (stderr === ""){
          return stdout;
        } else {
          throw stderr;
        }
      });
    }
 }
