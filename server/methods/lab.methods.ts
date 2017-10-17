
  import { Meteor } from 'meteor/meteor';
  import * as _ from "lodash";

  import { Lab, LabStatus } from '../../both/models/lab.model';
  import { Labs } from '../../both/collections/lab.collection';
  import { Role } from '../../both/models/user.model';
  import { Users } from '../../both/collections/user.collection';
  import { Course, ContentPermissions } from '../../both/models/course.model';
  import { Courses } from '../../both/collections/course.collection';

  function labsCourse(course_id){

    let course = Courses.findOne(course_id);
    if (_.isNil(course) || _.isUndefined(course)){
      throw new Meteor.Error("Course not Found");
    }

    switch(Users.getRoleFor(course_id, Meteor.userId())){

      case Role.guest:
        if(course.permissions.content !== ContentPermissions.Any){
          throw new Meteor.Error("Course not Accessible.");
        }

        return Labs.find({
          "course_id" : course_id,
          "status" : { $ne : LabStatus.hidden }
        }, {
          fields : {
            name : 1,
            description : 1,
            course_id : 1,
            updated : 1,
            status : 1
          }
        });

      case Role.student:
        if(course.permissions.content !== ContentPermissions.None){
          throw new Meteor.Error("Course not Accessible.");
        }

        return Labs.find({
          "course_id" : course_id,
          "status" : { $ne : LabStatus.hidden }
        }, {
          fields : {
            name : 1,
            description : 1,
            course_id : 1,
            updated : 1,
            status : 1
          }
        });

      case Role.instructor:
      case Role.course_admin:
      case Role.global_admin:
        return Labs.find({
          course_id : course_id
        });
    }
  }
  Meteor.publish('labs.course', labsCourse);
