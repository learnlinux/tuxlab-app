
import { CourseRecord } from '../../both/models/course_record.model';
import { CourseRecords } from '../../both/collections/course_record.collection';
import { Course, ContentPermissions } from '../../both/models/course.model';
import { Courses } from '../../both/collections/course.collection';
import { Role } from '../../both/models/user.model';
import { Users } from '../../both/collections/user.collection';

function courseRecordsId(course_id, user_id){
  if(!Meteor.userId()){
    throw new Meteor.Error("Not Authorized");
  }

  switch(Users.getRoleFor(course_id, Meteor.userId())){
    case Role.instructor:
    case Role.course_admin:
    case Role.global_admin:
      return CourseRecords.find({ user_id : user_id, course_id : course_id });
    case Role.student:
      if(user_id == Meteor.userId())
        return CourseRecords.find({ user_id : user_id, course_id : course_id });

    case Role.guest:
      throw new Meteor.Error("Unauthorized");
  }
}
Meteor.publish('course_records.id', courseRecordsId);
