/***
  COURSES SCHEMA
***/

// Simple Schema Creation
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

// https://github.com/aldeed/node-simple-schema/issues/146
const defaultValue = value => function autoValue() {
  if (!this.isUpdate && !this.isUpsert && !this.isSet) {
    return value;
  }
};

// Import Models
import { ContentPermissions, EnrollPermissions } from '../models/course.model'
import { Labs } from '../collections/lab.collection';
import { Users } from '../collections/user.collection';

/* Description Schema */
  const descriptionSchema = new SimpleSchema({
    content: {
      type: String,
      autoValue: defaultValue("")
    },
    syllabus: {
      type: String,
      autoValue: defaultValue("")
    }
  });

/* Permissions Schema */
const permissionsSchema = new SimpleSchema({
    meta: {
      type: Boolean,
      autoValue: defaultValue(true)
    },
    content: {
      type: Number,
      allowedValues: ContentPermissions,
      autoValue: defaultValue(ContentPermissions.Auth)
    },
    enroll: {
      type: Number,
      allowedValues: ContentPermissions,
      autoValue: defaultValue(ContentPermissions.None)
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
      regEx: SimpleSchema.RegEx.Id,
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
      autoValue: defaultValue(false)
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
        if (Meteor.isServer && typeof Labs.findOne({_id: this.value}) === undefined){
          return "invalidLab";
        }
      }
    }
  });
