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
      const allowed_fields = ["labs"];
      super.allow({
        update: function(user_id, course_record : CourseRecord, fields) {
          return _.reject(fields, key => _.includes(allowed_fields, key)).length === 0 &&
                 Users.getRoleFor(course_record.course_id, user_id) >= Role.instructor;
        },
        remove: function(user_id) { return Users.isGlobalAdministrator(user_id) },
        fetch: []
      });
    }
  }
  export const CourseRecords = new CourseRecordCollection();
