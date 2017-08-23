
// Imports
import * as _ from 'lodash';
import * as AdmZip from 'adm-zip';

// Get Collections
import { User } from '../../../both/models/user.model';
import { Users } from '../../../both/collections/user.collection';

import { CourseRecord } from '../../../both/models/course_record.model';
import { CourseRecords } from '../../../both/collections/course_record.collection';

export class Export {

  /*
     exportRecordsJSON
     Exports a directory of all the records in JSON
  */
  public static exportRecordsJSON(course_id : string) : Promise<Buffer>{

    // Create Zip
    var zip = new AdmZip();

    // Get Course Records
    return Promise.resolve(
      CourseRecords.find({
        course_id
      }).fetch()
    )

    // Get User Names for Course Records
    .then((course_records : CourseRecord[]) => {
      return _.map(course_records, (course_record) => {
        return [
          Users.findOne({ _id : course_record.user_id }),
          course_record
        ];
      })
    })

    // Add files to Zip Folder
    .then((res : [User,CourseRecord][]) => {
      _.forEach(res, ([user, course_record]) => {
        zip.addFile(user.profile.name+".json", new Buffer(JSON.stringify(course_record,null,2),"utf-8"), user._id);
      });
    })

    // Return Zip Buffer
    .then(() => {
      return zip.toBuffer()
    })
  }
}
