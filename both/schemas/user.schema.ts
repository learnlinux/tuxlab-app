/***
  USER SCHEMA
***/

// Simple Schema
import SimpleSchema from 'simpl-schema';

import { Role } from '../models/user.model';

/* Profile Schema */
  const profileSchema = new SimpleSchema({
    name: {
      type: String
    },
    organization: {
      type: String
    },
    picture: {
      type: String
    }
  });

/* Role Schema */
  const privilegeSchema = new SimpleSchema({
    course_id: {
      type: String
    },
    course_record: {
      type: String
    },
    role: {
      type: Role
    }
  });

/* User Schema */
  export const UserSchema : SimpleSchema = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    username: {
        type: String,
        regEx: /^[a-z0-9A-Z_]{3,15}$/
    },
    emails: {
        optional: true,
        type: Array
    },
    "emails.$": {
        type: new SimpleSchema({
          address: {
            type: String,
            regEx: SimpleSchema.RegEx.Email
          },
          verified: {
            optional: true,
            type: Boolean
          }
        })
    },
    createdAt: {
      type: Date
    },
    profile: {
      type: profileSchema,
      optional: true
    },
    services: {
      type: Object,
      optional: true,
      blackbox: true
    },
    global_admin: {
      type: Boolean,
      optional: true
    },
    roles: {
      type: Array,
      optional: true
    },
    'roles.$': {
      type: privilegeSchema
    }
  });
