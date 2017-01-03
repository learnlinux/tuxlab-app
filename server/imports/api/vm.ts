/*
 * TuxLab Env API
 * Provides an API to the TuxLab LabVMs for use in LabFiles.
 * @author: Derek Brown, Cem Ersoz
 */

/* Imports */
  import { ENV } from './env';

/*
 * VM_Options
 * Defines the options passed into Docker
 */


/*
 * VM
 * Provides access to a single lab-vm Docker Container.
 */
export class VM {
  /* CLASS VARIABLES */
    env : ENV; // Link to Parent VM

  /* CREATE LABVM */
    constructor(options, callback){

    }

  /* DESTROY LABVM */
    destroy(callback){


    }

}
