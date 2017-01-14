/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo';

  import { CourseRecordSchema } from '../schemas/course_record.schema';
  import { CourseRecord } from '../models/course_record.model';
  import { Users } from '../collections/user.collection';

/**
  CREATE COURSERECORD COLLECTION
**/
  class CourseRecordCollection extends Mongo.Collection<CourseRecord> {

    constructor(){
      super('course_records');
      this.attachSchema(CourseRecordSchema);

      // Set Editing Permissions
      this.allow({
        insert: function(user_id, course) {
          return Users.getRoleFor(user_id, course._id) >= 1;
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
