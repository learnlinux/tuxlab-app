/**
  TuxLab - Learn Linux Interactively
**/

// Get Meteor Object
  import {Meteor} from 'meteor/meteor';

/* STARTUP */
  import "./imports/startup/index.js";
  import './imports/startup/cache.js';
/* COLLECTIONS */
  Collections = {};

  // Logs
  Collections.logs = logs_collection;
  TuxLog.log('info','TuxLab Started!');

  // Users
  import "../collections/users.ts";

  // Courses
  import {courses} from "../collections/courses.ts";
  Collections.courses = courses;

  // Labs
  import {labs} from "../collections/labs.ts";
  Collections.labs = labs;

  // Course Records
  import {course_records} from "../collections/course_records.ts";
  Collections.course_records = course_records;

/* LABS */
//import Meteor Methods
import './imports/lab/index.js'
import './imports/course/index.js'
import './imports/lab/labMethods.ts'
