/*
 * TuxLab Env API
 * Provides an API to the TuxLab LabVMs for use in LabFiles.
 * @author: Derek Brown, Cem Ersoz
 */

  import { Docker } from 'dockerode/lib/docker';

  import { Defaults } from './vm.defaults';

  export module VM {

/**
 **  VM CONFIGURATION
 **/

    /* CONFIGURATION INTERFACE */
    export interface CustomConfig {
      image: string;
    }
    export type Config = string | CustomConfig;

    /* CONFIGURATION VALIDATOR */
    export function validateConfig (config : Config) : void {
      if (typeof config === "string"){
        if ( Defaults.indexOf(config) < 0){
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

/**
 **  VM INSTANCE
 **/
    export class Instance {

      constructor (config : Config) {

      }
    }

  }

  //  Docker.CreateContainerOptions
