/***
  LABS SCHEMA
***/

import { SimpleSchema } from 'simpl-schema';

import { Courses } from '../collections/course.collection';

/**********************/
/*    TASK SCHEMA     */
/**********************/

const taskSchema = new SimpleSchema({
    _id: {
      type: String
    },
    updated: {
      type: Number
    },
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
    _id: {
      type: String
    },
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
      type: [taskSchema]
    }
  });
