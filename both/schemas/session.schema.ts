/***
  SESSION SCHEMA
***/

import { SimpleSchema } from 'simpl-schema';

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
    type: Number
  },
  current_task:{
    type: Number
  },
  containers : {
    type: [ContainerSchema]
  }
});
