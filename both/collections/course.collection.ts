
/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { CourseSchema } from '../schemas/course.schema'
  import { Course } from '../models/course.model'
  import { Roles } from '../collections/user.collection'

/**
  CREATE COURSE COLLECTION
**/
  export const Courses = new Mongo.Collection<Course>('courses');
  Courses.attachSchema(CourseSchema);

  // Array of Allowed Fields
  const allowed = [
    'course_description',
    'instructors',
    'administrators',
    'permissions',
    'labs'
  ];

  // Set Editing Permissions
  Courses.allow({
    insert: Roles.isGlobalAdministrator,
    update: function(user_id : string, course : Course, fields : string[]){
      return Roles.isGlobalAdministrator(user_id) ||
             (Roles.isAdministratorFor(course._id, user_id) &&
              fields.every(function(field){return allowed.indexOf(field) >= 0})
             );
    },
    remove: Roles.isGlobalAdministrator,
    fetch: ["_id"]
  });

/**
  CREATE COURSE OBSERVABLE
**/
  export const CoursesObsv = new MongoObservable.Collection<Course>(Courses);
