/***
  SESSION SCHEMA
***/

// Simple Schema
import SimpleSchema from 'simpl-schema';

// Session Model
import { SessionStatus } from '../models/session.model';

const SessionTask = new SimpleSchema({
  feedback : {
    type : String,
    optional: true
  }
});

const ContainerSchema = new SimpleSchema({
  name : {
    type : String,
    optional: true
  },
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
  tasks : {
    type: Array
  },
  'tasks.$' : {
    type: SessionTask
  },
  containers : {
    type: Array
  },
  'containers.$' : {
    type: ContainerSchema
  }
});
