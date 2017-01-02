/***
  USER SCHEMA
***/

import { SimpleSchema } from 'simpl-schema';
import * as nconf from 'nconf';

/* Profile Schema */
  const profileSchema = new SimpleSchema({
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    nickname: {
      type: String,
      unique: true,
      regEx: /^[a-zA-Z0-9_-]*$/
    },
    school: {
      type: String,
      defaultValue: nconf.get('domain_school')
    },
    email: {
      type: String
    },
    picture: {
      type: String
    }
  });

/* Role Schema */
  const roleSchema = new SimpleSchema({
    administrator: {
      type: [String],
      defaultValue: []
    },
    instructor: {
      type: [String],
      defaultValue: []
    },
    student: {

      // Tuples of (CourseID, CourseRecordID)
      type: [{
        type: [String],
        maxCount: 2,
        minCount: 2
      }],
      defaultValue: []
    }
  });

/* Session Schema */
  const sessionSchema = new SimpleSchema({
    lab_id: {
      type: String
    },
    started:{
      type: Number,
  	  autoValue: function(){
  	     return Date.now();
  	  }
    }
  });

/* User Schema */
  export const UserSchema : SimpleSchema = new SimpleSchema({
    services: {
      type: Object,
      optional: true,
      blackbox: true
    },
    profile: {
      type: profileSchema
    },
    roles: {
      type: roleSchema
    },
    sessions:{
      type: [sessionSchema],
      defaultValue: []
    }
  });
