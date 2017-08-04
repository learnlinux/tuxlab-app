/**
  SESSION MODEL
**/

export enum SessionStatus {
  creating = 0, // Lock while Session is being Created
  active = 1, // Currently Active Session
  completed = 2, // Session was destroyed by tuxlab-app, success
  failed = 3, // Session was destroyed by tuxlab-app, failed
  destroyed = 4 // Session was destroyed by tuxlab-daemon
  // NOTE: THIS IS HARD-CODED INTO SESSION-DAEMON.
}

export interface Container {
  name? : string,
  container_ip: string,
  container_dns: string,
  container_id: string,
  container_username: string,
  container_pass: string,
  proxy_username: string,
}

export interface Session {
  _id? : string,

  user_id : string,
  lab_id: string,

  status: SessionStatus,
  expires: Date,
  current_task : number,

  containers : Container[]
}
