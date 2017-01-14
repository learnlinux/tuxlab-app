
/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'

  import { CourseSchema } from '../schemas/course.schema';
  import { Course } from '../models/course.model';
  import { Role } from '../models/user.model';
  import { Users } from '../collections/user.collection';

  // Array of Fields that can be Updated
  const allowed = [
    'course_name',
    'course_number',
    'course_description',
    'instructors',
    'permissions',
    'labs'
  ];

/**
  CREATE COURSE COLLECTION
**/
  export const Courses = new CourseCollection();
  class CourseCollection extends Mongo.Collection<Course> {
    constructor(){
      super('courses');
      this.attachSchema(CourseSchema);

      // Set Editing Permissions
      this.allow({
        insert: Users.isGlobalAdministrator,
        update: function(user_id : string, course : Course, fields : string[]){
          return Users.isGlobalAdministrator(user_id) ||
                 (Users.getRoleFor(course._id, user_id) >=  Role.course_administrator &&
                    fields.every(function(field){return allowed.indexOf(field) >= 0})
                 );
        },
        remove: Users.isGlobalAdministrator,
        fetch: ["_id"]
      });
    }
  }
