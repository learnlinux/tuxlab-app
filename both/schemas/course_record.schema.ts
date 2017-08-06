/***
  COURSE_RECORDS SCHEMA
***/

import * as _ from "lodash";
import { Meteor } from 'meteor/meteor';

// Simple Schema
import SimpleSchema from 'simpl-schema';

// Collections
import { Users } from '../collections/user.collection';
import { Courses } from '../collections/course.collection';
import { Labs } from '../collections/lab.collection';
import { Sessions } from '../collections/session.collection';

// Models
import { TaskStatus } from '../models/course_record.model';

/* Task Schema */
  const taskRecordSchema : SimpleSchema = new SimpleSchema({
    status: {
      type: Number,
      allowedValues: TaskStatus
    },
    grade: {
      type: Array,
      optional: true,
      minCount: 2,
      maxCount: 2
    },
    'grade.$': {
      type: Number
    },
    data: {
      type: Object,
      optional: true
    }
  });

/* Session Schema */
  const sessionRecordSchema = new SimpleSchema({
    data: {
      type: Object,
      optional: true
    },
    tasks: {
      type: Array
    },
    'tasks.$': {
      type: taskRecordSchema
    }
  });

/* Lab Schema */
  const labRecordSchema = new SimpleSchema({
    type: Object,
    blackbox: true,
    custom: function() {
      _.forEach(this.value, function(session_record, session_id){

        // Validate lab_id
        if (Meteor.isServer && typeof Sessions.findOne({ _id: this.session_id }) === undefined){
          return "invalidLab";
        }

        // Validate lab_record
        sessionRecordSchema.validate(session_record);
      });
    }
  });

/* Record Schema */
  export const CourseRecordSchema = new SimpleSchema({
    user_id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      custom: function() {
        if (Meteor.isServer && typeof Users.findOne({ _id: this.value }) === undefined){
          return "invalidUser";
        }
      }
    },
    course_id: {
      type: String,
      custom: function() {
        if (Meteor.isServer && typeof Labs.findOne({ _id: this.value }) === undefined){
          return "invalidLab";
        }
      }
    },
    labs: {
      type: Object,
      blackbox: true,
      custom: function() {
        _.forEach(this.value, function(lab_record, lab_id){

          // Validate lab_id
          if (Meteor.isServer && typeof Labs.findOne({ _id: this.lab_id }) === undefined){
            return "invalidLab";
          }

          // Validate lab_record
          labRecordSchema.validate(lab_record);
        });
      }
    }
  });
