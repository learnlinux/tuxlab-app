/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { CourseRecordSchema } from '../models/course_record.schema'
  import { CourseRecord } from '../models/course_record.model'
  import { Roles } from '../collections/user.collection'

/**
  CREATE COURSERECORD COLLECTION
**/
  export const CourseRecords = new Mongo.Collection<CourseRecord>('course_records');
  CourseRecords.attachSchema(CourseRecordSchema);

  // Set Editing Permissions
  CourseRecords.allow({
    insert: Roles.isGlobalAdministrator,
    update: Roles.isGlobalAdministrator,
    remove: Roles.isGlobalAdministrator,
    fetch: []
  });

/**
  CREATE COURSERECORD OBSERVABLE
**/
export const CourseRecordsObsv = new MongoObservable.Collection<CourseRecord>(CourseRecords);
