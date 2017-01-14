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
  export const CourseRecords = new CourseRecordCollection();
  class CourseRecordCollection extends Mongo.Collection<CourseRecord> {

    constructor(){
      super('course_records');
      this.attachSchema(CourseRecordSchema);

      // Set Editing Permissions
      this.allow({
        insert: Users.isGlobalAdministrator,
        update: Users.isGlobalAdministrator,
        remove: Users.isGlobalAdministrator,
        fetch: []
      });
    }
  }
