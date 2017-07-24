/**
  SESSION MODEL
**/

export enum SessionStatus {
  active = 0, // Currently Active Session
  completed = 1, // Session was destroyed by tuxlab-app, success
  failed = 2, // Session was destroyed by tuxlab-app, failed
  destroyed = 3 // Session was destroyed by tuxlab-daemon
  // NOTE: THIS IS HARD-CODED INTO SESSION-DAEMON.
}

export interface Container {
  container_ip: string,
  container_id: string,
  container_pass: string
}

export interface Session {
  _id? : string,
  session_id: string,
  user_id : string,
  lab_id: string,
  status: SessionStatus,
  expires: Date,
  current_task : number,
  containers : Container[]
}
