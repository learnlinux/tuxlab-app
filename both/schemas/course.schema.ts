/***
  COURSES SCHEMA
***/

// Simple Schema Creation
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

// Import Models
import { ContentPermissions, EnrollPermissions } from '../models/course.model'
import { Labs } from '../collections/lab.collection';
import { Users } from '../collections/user.collection';

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

/* Course Schema */
  export const CourseSchema = new SimpleSchema({
    course_name: {
      type: String
    },
    course_number: {
      type: String
    },
    instructors: {
      type: Array
    },
    'instructors.$': {
      type: String,
      custom: function(){
        if (Meteor.isServer && typeof Users.findOne({ _id: this.value }) === undefined){
          return "invalidUser";
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
      type: Array
    },
    'labs.$':{
      type: String,
      custom: function() {
        if (typeof Labs.findOne({_id: this.value}) === undefined){
          return "invalidLab";
        }
      }
    }
  });
