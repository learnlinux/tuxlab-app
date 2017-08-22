
/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable, ObservableCursor } from 'meteor-rxjs';

  import { Role } from '../models/user.model';
  import { Users } from '../collections/user.collection';

  import { CourseSchema } from '../schemas/course.schema';
  import { Course } from '../models/course.model';

  import { Lab, LabFileImportOpts } from '../models/lab.model';
  import { Labs } from '../collections/lab.collection';

  import { CourseRecords } from '../collections/course_record.collection';

  import { Sessions } from '../collections/session.collection';

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

    public setFeatured(course_id : string, featured : boolean) : Promise<any> {
      return new Promise((resolve, reject) => {
        this.update({
          "_id" : course_id
        }, {
          "$set" : {
            featured : featured
          }
        }, (err, res) => {
          if (err){
            reject(err);
          } else {
            resolve();
          }
        });
      })
    }

    public deleteCourse(course_id : string) : Promise<any> {

      // Delete Course Itself
      return new Promise((resolve, reject) => {
        this.remove({
          "_id" : course_id
        }, (err, res) => {
          if(err){
            reject(err);
          } else {
            resolve();
          }
        })
      })

      // Delete Labs
      .then(() => {
        return new Promise((resolve, reject) => {
          Labs.remove({
            course_id : course_id
          }, (err, res) => {
            if(err){
              reject(err);
            } else {
              resolve();
            }
          });
        });
      })

      // Delete Course Records
      .then(() => {
        return new Promise((resolve, reject) => {
          CourseRecords.remove({
            course_id : course_id
          }, (err, res) => {
            if(err){
              reject(err);
            } else {
              resolve();
            }
          });
        });
      })

      // Delete Sessions
      .then(() => {
        return new Promise((resolve, reject) => {
          Sessions.remove({
            course_id : course_id
          }, (err, res) => {
            if(err){
              reject(err);
            } else {
              resolve();
            }
          });
        });
      })
    }

  }
  export const Courses = new CourseCollection();
