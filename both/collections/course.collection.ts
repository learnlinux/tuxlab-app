
/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

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
  class CourseCollection extends Mongo.Collection<Course> {
    public observable : MongoObservable.Collection<Course>;

    constructor(){
      super('courses');
      this.attachSchema(CourseSchema);

      // Create Observable
      this.observable = new MongoObservable.Collection(this);

      // Set Editing Permissions
      this.allow({
        insert: Users.isGlobalAdministrator,
        update: function(user_id : string, course : Course, fields : string[]){
          return Users.isGlobalAdministrator(user_id) ||
                 (Users.getRoleFor(course._id, user_id) >=  Role.course_admin &&
                    fields.every(function(field){return allowed.indexOf(field) >= 0})
                 );
        },
        remove: Users.isGlobalAdministrator,
        fetch: ["_id"]
      });
    }

    public addInstructor(course_id : string, user_id : string){
      this.update({ _id: course_id }, { '$addToSet' : { instructors : user_id}});
    }

    public removeInstructor(course_id : string, user_id : string){
      this.update({ _id: course_id }, { '$pull' : { instructors : user_id}});
    }
  }
  export const Courses = new CourseCollection();
