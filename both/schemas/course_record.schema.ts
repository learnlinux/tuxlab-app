/***
  COURSE_RECORDS SCHEMA
***/

// Simple Schema Creation
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'simpl-schema';

// Collections
import { Users } from '../collections/user.collection';
import { Courses } from '../collections/course.collection';
import { Labs } from '../collections/lab.collection';

// Models
import { TaskStatus } from '../models/course_record.model';

/* Task Schema */
  const taskRecordSchema : SimpleSchema = new SimpleSchema({
    _id: {
      type: String
    },
    status: {
      type: Number,
      allowedValues: TaskStatus
    },
    grade: {
      type: [Number],
      minCount: 2,
      maxCount: 2
    },
    data: {
      type: Object,
      optional: true
    },
    attempted: {
      type: [Number],
      decimal: false
    }
  });

/* Lab Schema */
  const labRecordSchema = new SimpleSchema({
    lab_id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      custom: function() {
        if (Meteor.isServer && typeof Labs.findOne({ _id: this.value }) === undefined){
          return "invalidLab";
        }
      }
    },
    data: {
      type: Object,
      optional: true
    },
    attempted: {
      type: [Number]
    },
    tasks: {
      type: [taskRecordSchema]
    }
  });

/* Record Schema */
  export const CourseRecordSchema = new SimpleSchema({
    user_id: {
      type: String,
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
      type: [labRecordSchema]
    }
  });
