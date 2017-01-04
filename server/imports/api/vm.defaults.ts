/*
 * TuxLab VM Defaults
 * Stores default Docker VM options for provided LabVMs.
 * @author: Derek Brown, Cem Ersoz
 */

 import { VM } from './vm';

 /* tuxlab/labvm-alpine */
 const alpine : VM.CustomConfig = {
   image: "tuxlab/labvm-alpine",
   cmd: "./entry.sh",
   username: "root",
   password_path: "/pass"
 }

 /* tuxlab/labvm-rhel7 */
 const rhel7 : VM.CustomConfig = {
   image: "tuxlab/labvm-rhel7",
   cmd: "./entry.sh",
   username: "root",
   password_path: "/pass"
 }

 export const Defaults = {
   alpine : alpine,
   rhel7 : rhel7
 }
