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

/* Instructions Schema */
  const instructorSchema = new SimpleSchema({
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
      type: [instructorSchema],
      custom: function() {
        let instructorIds = this.value.map(function(tuple) {
          return tuple.id;
        });
        let validInstructors = Meteor.users.find({ _id: { $in: instructorIds } });

        // Check that all instructors exist
        if(validInstructors.count() !== this.value.length) {
          return("One or more instructors are invalid.");
        }
        else{
          return(null);
        }
      }
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
