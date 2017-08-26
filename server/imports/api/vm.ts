/*
 * TuxLab VM Interface
 * VM Object Passed to the Instructor inside of the Setup Function.
 * @author: Derek Brown, Cem Ersoz
 *
 *  NOTE: Because of convience methods extended in session.ts,
 *  there can be no namespace conflicts between VM and Session.
 */

export interface VM {

  /*
    shell
    executes a shell command, returning an array of
    stdout, sterr.
  */
  shell: (command : string | string[]) => Promise<[String,String]>;
}
