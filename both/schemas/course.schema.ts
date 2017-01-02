/***
  COURSES SCHEMA
***/

// Simple Schema Creation
import { SimpleSchema } from 'simpl-schema';
import * as nconf from 'nconf';

// Import Models
import { ContentPermissions, EnrollPermissions } from '../models/course.model'

// Validate Labs
import { Labs } from '../collections/lab.collection';

/* Description Schema */
  const descriptionSchema = new SimpleSchema({
    content: {
      type: String,
      defaultValue: ""
    },
    syllabus: {
      type: String,
      defaultValue: ""
    }
  });

/* Permissions Schema */
const permissionsSchema = new SimpleSchema({
    meta: {
      type: Boolean,
      defaultValue: true
    },
    content: {
      type: Number,
      allowedValues: ContentPermissions,
      defaultValue: ContentPermissions.Auth
    },
    enroll: {
      type: Number,
      allowedValues: ContentPermissions,
      defaultValue: ContentPermissions.None
    }
  });

/* User Schema */
  const userSchema = new SimpleSchema({
    name: {
      type: String
    },
    id: {
      type: String
    }
  });

/* Course Schema */
  export const CourseSchema = new SimpleSchema({
    _id: {
       type: String
    },
    course_name: {
      type: String
    },
    course_number: {
      type: String
    },
    instructors: {
      type: [userSchema]
      //TODO Verify inclusion in user instructor list
    },
    administrators: {
      type: [userSchema]
      //TODO Verify inclusion in user administrators list
    },
    course_description: {
      type: descriptionSchema,
      optional: true
    },
    featured:{
      type: Boolean,
      defaultValue: false
    },
    permissions:{
      type: permissionsSchema,
    },
    labs: {
      type: [String],
      custom: function() {
        let validLabs = Labs.find({ _id: { $in: this.value } });
        // Check that all labs are valid
        if(validLabs.count() !== this.value.length) {
          return("One or more labs were invalid.");
        }
        else{
          return(null);
        }
      }
    }
  });
