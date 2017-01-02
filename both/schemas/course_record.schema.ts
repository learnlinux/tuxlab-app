/***
  COURSE_RECORDS SCHEMA
***/

// Simple Schema Creation
import { SimpleSchema } from 'simpl-schema';
import * as nconf from 'nconf';

// Collections
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
        if(typeof Labs.findOne({ _id: this.value }) === "undefined") {
          labRecordSchema.addInvalidKeys([{name: "lab_id", type: "nonexistantLab"}]);
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
        if(typeof Meteor.users.findOne({ _id: this.value }) === "undefined") {
          CourseRecordSchema.addInvalidKeys([{name: "user_id", type: "nonexistantUser"}]);
        }
      }
    },
    course_id: {
      type: String,
      custom: function() {
        let courseId = this.value;
        if (typeof Courses.findOne({ _id: courseId }) === "undefined") {
          CourseRecordSchema.addInvalidKeys([{name: "course_id", type: "nonexistantCourse"}])
        }
      }
    },
    labs: {
      type: [labRecordSchema]
    }
  });
