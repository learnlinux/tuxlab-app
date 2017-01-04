/*
 * TuxLab Env API
 * Provides an API to the TuxLab LabVMs for use in LabFiles.
 * @author: Derek Brown, Cem Ersoz
 */

  import * as _ from "underscore";
  import { Docker } from 'dockerode/lib/docker';

  import { Defaults } from './vm.defaults';

  export module VM {

/**********************/
/*  VM CONFIGURATION  */
/**********************/

    /* CONFIGURATION INTERFACE */
    export interface CustomConfig {

      // IMAGE DETAILS
      image: string; // Image Name from DockerHub
      cmd : string; // Entry Command. Defaults to entry.sh

      // USER DETAILS
      username : string; // User to login. Defaults to root.
      password_path : string; // Path to randomly-generated SSH Password.

    }
    export type Config = string | CustomConfig;

    /* CONFIGURATION VALIDATOR */
    export function validateConfig (config : Config) : void {
      if (typeof config === "string"){
        if (!_.has(Defaults, config)){
          throw new Error('MissingConfig');
        } else {
          return;
        }
      } else if (typeof config === "object") {
        //TODO: Implement nconf setting for Custom Config
        throw new Error('CustomConfigNotPermitted');
      } else {
        throw new Error('InvalidConfig');
      }
    }

/**********************/
/*     VM INSTANCE    */
/**********************/
  
    export abstract class Instance {
      private config : CustomConfig;

      /*
        CONSTRUCTOR
        Creates an Instance Object.

        NOTE: Doesn't create a container (yet).  That is done with the create()
        method defined below.
      */
      constructor (config : Config) {
        if (typeof config === "string" && typeof Defaults[config] === "object") {
          this.config = Defaults[config];
        } else if (typeof config === "object" && validateConfig(config)) {
          this.config = config;
        } else {
          throw new Error('InvalidConfig');
        }
      }

    }

  }
