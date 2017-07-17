/***
  LABS SCHEMA
***/

// Simple Schema
import SimpleSchema from 'simpl-schema';

import { Courses } from '../collections/course.collection';

/**********************/
/*    TASK SCHEMA     */
/**********************/

const taskSchema = new SimpleSchema({
    name: {
      type: String
    },
    md: {
      type: String,
      defaultValue: ""
    }
  });

/**********************/
/*     LAB SCHEMA     */
/**********************/
  export const LabSchema = new SimpleSchema({
    course_id: {
      type: String,
      custom: function() {
        if (typeof Courses.findOne({ _id: this.value }) === undefined){
          return "invalidCourses";
        }
      }
    },
    name: {
      type: String
    },
    description:{
      type: String,
      optional: true
    },
    updated: {
      type: Number,
      autoValue: function(){
        return Date.now();
      }
    },
    hidden:{
      type: Boolean,
      defaultValue: true
    },
    disabled:{
      type: Boolean,
      defaultValue: false
    },
    file: {
      type: String
    },
    tasks: {
      type: Array
    },
    'tasks.$':{
      type: taskSchema
    }
  });
