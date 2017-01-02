/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { CourseRecordSchema } from '../schemas/course_record.schema'
  import { CourseRecord } from '../models/course_record.model'

/**
  CREATE COURSE_RECORD COLLECTION
**/
  export const CourseRecords = new Mongo.Collection<CourseRecord>('course_records');
  CourseRecords.attachSchema(CourseRecordSchema);
  export const CourseRecordsObsv = new MongoObservable.Collection<CourseRecord>(CourseRecords);
