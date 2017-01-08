/*
 * TuxLab VMConfig
 * Interface describing a VM configuration for TuxLab
 */

   import * as _ from "underscore";

  /* CONFIGURATION INTERFACE */
  export interface VMConfigCustom {
    // IMAGE DETAILS
    image: string; // Image Name from DockerHub
    cmd : string; // Entry Command. Defaults to entry.sh

    // USER DETAILS
    username : string; // User to login. Defaults to root.
    password_path : string; // Path to randomly-generated SSH Password.
  }
  export type VMConfig = VMConfigCustom | string;

  /* CONFIGURATION DEFAULTS */
  const alpine : VMConfigCustom = {
    image: "tuxlab/labvm-alpine",
    cmd: "./entry.sh",
    username: "root",
    password_path: "/pass"
  }

  /* tuxlab/labvm-rhel7 */
  const rhel7 : VMConfigCustom = {
    image: "tuxlab/labvm-rhel7",
    cmd: "./entry.sh",
    username: "root",
    password_path: "/pass"
  }

  const VMConfigDefault = {
    alpine : alpine,
    rhel7 : rhel7
  }

  export function getDefaultConfig(config_name : string){
    if (_.has(VMConfigDefault, config_name)){
      return VMConfigDefault[config_name];
    }
    else {
      throw new Error('MissingConfig');
    }
  }

  /* CONFIGURATION VALIDATOR */
  export function VMValidateConfig (config : VMConfig) : boolean {
    if (typeof config === "string"){
      if (! _.has(VMConfigDefault, config)){
        throw new Error('MissingConfig');
      } else {
        return true;
      }
    } else if (typeof config === "object") {
      //TODO: Implement Security for Custom Config
      throw new Error('CustomConfigNotPermitted');
    } else {
      throw new Error('InvalidConfig');
    }
  }
