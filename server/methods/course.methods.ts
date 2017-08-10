
  import { Meteor } from 'meteor/meteor';
  import * as _ from "lodash";

  import { Course, ContentPermissions } from '../../both/models/course.model';
  import { Courses } from '../../both/collections/course.collection';
  import { Role } from '../../both/models/user.model';
  import { Users } from '../../both/collections/user.collection';

  /* PUBLICATION */
  const explore_limit = 20;
  function coursesExplore(skip){
    return Courses.find({
      "permissions.meta" : true,
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
    switch(Users.getRoleFor(course_id, Meteor.userId())){
      case Role.guest:
        return Courses.find({
          "_id" : course_id,
          "permissions.content" : ContentPermissions.Any
        });
      case Role.student:
        return Courses.find({
          "_id" : course_id,
          "permissions.content" : { "$ne" : ContentPermissions.None }
        });

      case Role.instructor:
      case Role.course_admin:
      case Role.global_admin:
        return Courses.find({ _id : course_id });
    }
  }
  Meteor.publish('courses.id', coursesId);

  /* METHODS */
  Meteor.methods({
    'Courses.reorderLabs'(course_id : string, labs : string[]){
      return Courses.reorderLabs(course_id, labs)
      .catch((err) => {
        console.error(err);
        throw new Meteor.Error("Redorder Conflict");
      });
    }
  })
