/***
  SESSION SCHEMA
***/

// Simple Schema
import SimpleSchema from 'simpl-schema';

// Session Model
import { SessionStatus } from '../models/session.model';

const ContainerSchema = new SimpleSchema({
  container_ip : {
    type : String
  },
  container_id : {
    type : String
  },
  proxy_username: {
    type: String
  },
  container_username: {
    type: String
  },
  container_pass : {
    type : String
  }
});

export const SessionSchema : SimpleSchema = new SimpleSchema({
  user_id: {
    type: String
  },
  lab_id: {
    type: String
  },
  status:{
    type: Number
  },
  expires:{
    type: Date
  },
  current_task:{
    type: Number
  },
  containers : {
    type: Array
  },
  'containers.$' : {
    type: ContainerSchema
  }
});
