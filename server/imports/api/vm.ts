/*
 * TuxLab Env API
 * Provides an API to the TuxLab LabVMs for use in LabFiles.
 * @author: Derek Brown, Cem Ersoz
 */

  import { Docker } from 'dockerode/lib/docker';
  import { Environment } from './environment';

  export module VM {

    interface CustomConfig {
      image: string;
    }
    export type Config = string | CustomConfig;

    export class Instance {

    }
  }

  //  Docker.CreateContainerOptions
