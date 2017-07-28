/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo';
  import { MongoObservable } from 'meteor-rxjs';

  import { CourseRecordSchema } from '../schemas/course_record.schema';
  import { CourseRecord } from '../models/course_record.model';
  import { Users } from '../collections/user.collection';
  import { Role } from '../models/user.model';

/**
  CREATE COURSERECORD COLLECTION
**/
  class CourseRecordCollection extends Mongo.Collection<CourseRecord> {
    public observable : MongoObservable.Collection<CourseRecord>;

    constructor(){
      super('course_records');

      // Attach Schema
      this.attachSchema(CourseRecordSchema);

      // Create Observable
      this.observable = new MongoObservable.Collection(this);

      // Set Editing Permissions
      this.allow({
        insert: function(user_id, course) {
          return Users.getRoleFor(user_id, course._id) >= Role.instructor;
        },
        update: function(user_id, course, fields) {
          return Users.isGlobalAdministrator(user_id);
        },
        remove: function(user_id, course) {
          return Users.isGlobalAdministrator(user_id);
        },
        fetch: []
      });
    }
  }
  export const CourseRecords = new CourseRecordCollection();
