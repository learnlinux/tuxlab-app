/**
  SESSION MODEL
**/

export enum SessionStatus {
  creating = 0, // Lock while Session is being Created
  active = 1, // Currently Active Session
  completed = 2, // Session was destroyed by tuxlab-app, success
  failed = 3, // Session was destroyed by tuxlab-app, failed
  destroyed = 4 // Session was destroyed by tuxlab-daemon
}

export interface SessionTask {
  feedback : string
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
  course_id : string,
  lab_id: string,

  // Status
  status: SessionStatus,
  expires: Date,

  // Tasks
  current_task : number,
  tasks : SessionTask[],

  containers : Container[]
}
