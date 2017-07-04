/***
  SESSION SCHEMA
***/

// Simple Schema
import SimpleSchema from 'simpl-schema';

// Session Model
import { SessionStatus } from '../models/session.model';

const ContainerSchema = new SimpleSchema({
  conntainer_id : {
    type : String
  }
});

export const SessionSchema : SimpleSchema = new SimpleSchema({
  session_id: {
    type: String
  },
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
