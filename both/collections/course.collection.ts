
/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable, ObservableCursor } from 'meteor-rxjs';

  import { CourseSchema } from '../schemas/course.schema';
  import { Course } from '../models/course.model';

  import { Role } from '../models/user.model';
  import { Users } from '../collections/user.collection';

  import { Lab, LabFileImportOpts } from '../models/lab.model';
  import { Labs } from '../collections/lab.collection';

  // Array of Fields that can be Updated
  const allowed = [
    'name',
    'course_number',
    'description',
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
      super.allow({
        insert: function(user_id : string) { return Users.isGlobalAdministrator(user_id) },
        update: function(user_id : string, course : Course, fields : string[]){
          return Users.isGlobalAdministrator(user_id) ||
                 (Users.getRoleFor(course._id, user_id) >=  Role.course_admin &&
                    fields.every(function(field){return allowed.indexOf(field) >= 0})
                 );
        },
        remove: function(user_id) { return Users.isGlobalAdministrator(user_id) },
        fetch: ["_id"]
      });
    }

    public getLabs(course_id : string) : ObservableCursor<Lab> {
      var course;
      if(typeof (course = super.findOne({ _id: course_id })) !== "undefined"){
        return Labs.observable.find({ _id : { '$in' : course.labs }});
      }
    }


  }
  export const Courses = new CourseCollection();
