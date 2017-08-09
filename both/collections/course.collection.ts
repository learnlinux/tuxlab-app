
/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { CourseSchema } from '../schemas/course.schema';
  import { Course } from '../models/course.model';
  import { Role } from '../models/user.model';
  import { Lab } from '../models/lab.model';

  import { Users } from '../collections/user.collection';
  import { Labs } from '../collections/lab.collection';

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

    public addInstructor(course_id : string, user_id : string){
      this.update({ _id: course_id }, { '$addToSet' : { instructors : user_id}});
    }

    public removeInstructor(course_id : string, user_id : string){
      this.update({ _id: course_id }, { '$pull' : { instructors : user_id}});
    }

    public addLab(course_id : string, lab_id  : string){
      this.update({ _id: course_id }, { '$addToSet' : { labs : lab_id }});
    }

    public removeLab(course_id : string, lab_id : string){
      this.update({ _id: course_id }, { '$pull' : { instructors : lab_id}});
    }

    public getLabs(course_id : string){
      var course;

      if(typeof (course = this.findOne({ _id: course_id })) !== "undefined"){
        return Labs.observable.find({ _id : { '$in' : course.labs }});
      }
    }

    public reorderList(course_id : string, labs : string[]) : Promise<any>{
      return new Promise(function(resolve, reject){
        this.rawCollection().findAndModify({ _id : course_id, $all : { labs : labs }},{},{ $set : { labs : labs } }, (err, res) => {
          if(err){
            reject(err);
          } else {
            resolve();
          }
        });
      })
    }

  }
  export const Courses = new CourseCollection();
