/*
* TuxLab Session Class
* Uppermost controller class for a Lab.
* @author: Derek Brown, Cem Ersoz
*/

/* GLOBAL IMPORTS */
import * as fs from 'fs';
import { ConfigService } from '../services/config';

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

/* SESSION IMPORTS */
import { Task } from '../../../both/models/lab.model';
interface Instruction {
  id: number;
  name: string;
  md: string;
  log: string;
}

import { VMConfigCustom } from '../api/vmconfig';
import { InitObject, SetupObject, VerifyObject } from '../api/environment';

import { Container } from './container';
import { LabRuntime } from './lab_runtime';

export class Session {

  // Lab Runtime
  private _lab : LabRuntime;
  public user;
  public instructions : Instruction[];
  public current_task = 0;

  // Containers
  private _containers : Container[];

  // Ready Function
  private _ready : Promise<Session>;
  public ready() : Promise<{}> {
    return this._ready;
  }

/************************
 *     CONSTRUCTOR      *
 ************************/
  constructor (lab : LabRuntime){
    this._ready =

    // Copy LabRuntime Instructions
    new Promise((resolve, reject) => {

      this._lab = lab;
      this.instructions = _.map(this._lab.tasks, function(task){
        let instruction = <Instruction>_.clone(task);
            instruction.log = "";
        return instruction;
      });

    // Get VMConfig from Runtime
    }).then(() => {
        return lab.getVMConfig();

    // Create Containers
    }).then((vm : VMConfigCustom[]) => {
        this._containers = _.map(vm, (config) => {
            return new Container(config);
        });
        return;

    // Initialize Container
    }).then(() => {

        // Execute in Parallel
        return Promise.all([this.container_init(), this.etcd_create()]);
    });

  }

/************************
 *      DESTRUCTOR      *
 ************************/
 public destroy() : void {

 }

/************************
*  ENVIRONMENT OBJECT  *
************************/

  private getEnvironmentObject(){
    return {
      vm: _.map(this._containers, (container) => {
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
    return new SetupObject(_.extend(this.getEnvironmentObject(),this.getTaskObject(),
    {
      success: success,
      failure: failure
    }));
  }

  private getVerifyObject(completed, failed, retry) : VerifyObject {
    return new VerifyObject(_.extend(this.getEnvironmentObject(),this.getTaskObject(),
    {
      setGrade: (n : number, d : number) => {

      },
      completed: completed,
      failed: failed,
      retry: retry
    }));
  }

/************************
 *      ETCD OBJECT     *
 ************************/
  private etcd_create() : Promise<{}>{
    // Create Proxy Records
    let createProxy = new Promise((resolve, reject) => {
          let record = {
          };

          etcd.set('/redrouter/SSH::'+this.user, record, {

          }, (err, res) => {

          });
      });

    // Create DNS Records
    let createDNS = new Promise((resolve, reject) => {

    });

    // Create Session Records
    let createSession = new Promise((resolve, reject) => {

    });

    // RETURN
    return Promise.all([createProxy, createDNS, createSession]);
  }

}
