
  import { Meteor } from 'meteor/meteor';

  import { Lab, LabStatus } from '../../both/models/lab.model';
  import { Labs } from '../../both/collections/lab.collection';
  import { Role } from '../../both/models/user.model';
  import { Users } from '../../both/collections/user.collection';
  import { Course, ContentPermissions } from '../../both/models/course.model';
  import { Courses } from '../../both/collections/course.collection';

  function coursesUser(){
    return Users.getCoursesFor(Meteor.userId());
  }
  Meteor.publish('courses.user', coursesUser);

  function labsCourse(course_id){
    if(!Meteor.userId()){
      throw new Meteor.Error("Not Authorized");
    }

    let course : Course = Courses.findOne({ _id : course_id });

    switch(Users.getRoleFor(course_id, Meteor.userId())){
      case Role.guest:
        if(course.permissions.content === ContentPermissions.Auth)
          throw new Meteor.Error("Unauthorized");

      case Role.student:
        if(course.permissions.content === ContentPermissions.None)
          throw new Meteor.Error("Unauthorized");
        else
          return Labs.find({
            course_id : course_id,
            status : { $ne : LabStatus.hidden }
          }, {
            fields : {
              name : 1,
              description : 1,
              course_id : 1,
              updated : 1,
              status : 1,
              file : 0,
              tasks : 0
            }
          });

      case Role.instructor:
      case Role.course_admin:
      case Role.global_admin:
        return Labs.find({ course_id : course_id });
    }
  }
  Meteor.publish('labs.course', labsCourse);
