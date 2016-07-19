
/* Create Collections Object */
  Collections = {};

  // Courses
  import {courses} from "../collections/courses.ts";
  Collections.courses = courses;
  import {course_records} from "../collections/course_records.ts";
  Collections.course_records = course_records;

  // Labs
  import {labs} from "../collections/labs.ts";
  Collections.labs = labs;
