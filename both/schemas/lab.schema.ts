/***
  LABS SCHEMA
***/

// Simple Schema
import SimpleSchema from 'simpl-schema';

import { LabStatus } from '../models/lab.model';
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
    status : {
      type: Number,
      allowedValues: LabStatus
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
