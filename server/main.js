/**
  TuxLab - Learn Linux Interactively
**/

// Get Meteor Object
import {Meteor} from 'meteor/meteor';

// Startup
import "./imports/startup/index.js";

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


//import meteor methods
// LabFile Cache
var NodeCache = require('node-cache');
    LabCache = new NodeCache({
      stdTTL: nconf.get('labvm_idle_timeout'),
      useClones: false,
      errorOnMissing: false
    });
//TODO Cleanup Cache on Exit (Blocked by Meteor)

//import Meteor Methods
import "./imports/lab/methods.ts"
import "./imports/course/methods.ts"
