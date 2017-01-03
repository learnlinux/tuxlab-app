/*
 * TuxLab Env API
 * Provides an API to the TuxLab LabVMs for use in LabFiles.
 * @author: Derek Brown, Cem Ersoz
 */

/* IMPORTS */
  import { VM } from './vm';

/*
 * ENV
 * Provides access to the enviornment setup for a single lab.
 */
 export class ENV {
     user : string;  // user_id of owner
     created: number; // datetime created

     defaultVM: VM; // default lab-vm
     VMs: VM[]; // array of all VMs
 }
