/**
  TuxLab - Learn Linux Interactively
**/

// Get Meteor Object
import {Meteor} from 'meteor/meteor';

// Startup
import "./imports/startup/index.js";

// Create Collections
Collections = {};
import "../collections/users.ts";

import {courses} from "../collections/courses.ts";
Collections.courses = courses;

import {course_records} from "../collections/course_records.ts";
Collections.course_records = course_records;

//import meteor methods
import "./imports/lab/methods.ts"
