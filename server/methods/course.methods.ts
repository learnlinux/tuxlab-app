
  import { Meteor } from 'meteor/meteor';
  import * as _ from "lodash";

  import { Course, ContentPermissions } from '../../both/models/course.model';
  import { Courses } from '../../both/collections/course.collection';
  import { Role } from '../../both/models/user.model';
  import { Users } from '../../both/collections/user.collection';

  const explore_limit = 20;
  function coursesExplore(skip){
    return Courses.find({
      "permssions.meta" : true,
      "permissions.content" : ContentPermissions.Any
    }, {
      skip : skip,
      limit: explore_limit
    });
  }
  Meteor.publish('courses.explore', coursesExplore);

  function coursesUser(){
    return Users.getCoursesFor(Meteor.userId());
  }
  Meteor.publish('courses.user', coursesUser);

  function coursesId(course_id){
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
      case Role.instructor:
      case Role.course_admin:
      case Role.global_admin:
        break;
    }
    return Courses.find({ _id : course_id });
  }
  Meteor.publish('courses.id', coursesId);
