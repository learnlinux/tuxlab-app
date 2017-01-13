/**
  SESSION MODEL
**/

export enum SessionStatus {
  active = 0, // Currently Active Session
  completed = 1, // Session was destroyed by tuxlab-app
  terminated = 2 // Session was destroyed by tuxlab-daemon
}

export interface Container {
  container_id: string
}

export interface Session {
  _id? : string,
  session_id : string,
  user_id : string,
  lab_id: string,
  status: SessionStatus,
  current_task : number,
  containers : Container[]
}
