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
    email: {
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
    services: {
      type: Object,
      optional: true,
      blackbox: true
    },
    profile: {
      type: profileSchema
    },
    global_admin: {
      type: Boolean
    },
    roles: {
      type: Array
    },
    'roles.$': {
      type: privilegeSchema
    }
  });
