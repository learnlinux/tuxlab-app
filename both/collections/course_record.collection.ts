/**
  IMPORTS
**/
  import * as _ from 'lodash';
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
      super.attachSchema(CourseRecordSchema);

      // Create Observable
      this.observable = new MongoObservable.Collection(this);

      // Permissions
      const allowed_fields = [];
      super.allow({
        update: function(user_id, course_record : CourseRecord, fields) {
          return _.intersection(fields, allowed_fields).length === 0 &&
                 Users.getRoleFor(user_id, course_record.course_id) >= Role.instructor;
        },
        fetch: []
      });
    }
  }
  export const CourseRecords = new CourseRecordCollection();
