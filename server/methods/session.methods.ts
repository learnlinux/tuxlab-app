/**
  IMPORTS
**/

import { Meteor } from 'meteor/meteor';

import { Session } from '../imports/runtime/session';
import { Sessions } from '../../both/collections/session.collection';
import { SessionStatus } from '../../both/models/session.model';

import { Role } from '../../both/models/user.model';
import { Users } from '../../both/collections/user.collection';

/* PUBLICATION */
function sessionsUserCourse(user_id : string, course_id : string){
  if(!Meteor.userId()){
    throw new Meteor.Error("Not Authorized");
  }

  switch(Users.getRoleFor(course_id, Meteor.userId())){
    case Role.instructor:
    case Role.course_admin:
    case Role.global_admin:
      return Sessions.find({ user_id : user_id, course_id : course_id });
    case Role.student:
    case Role.guest:
      throw new Meteor.Error("Unauthorized");
  }
}
Meteor.publish('Sessions.userCourse',sessionsUserCourse);

/* LAB METHODS */
Meteor.methods({

  'Sessions.getOrCreate'(lab_id){
      const user_id = Meteor.userId();

      if(user_id){
        return Session.getSession(user_id, lab_id)
        .then((session) => {
          return session.getJSON();
        })
      } else {
        throw new Meteor.Error("Authorization Required");
      }
  },

  'Sessions.renew'(lab_id){
    const user_id = Meteor.userId();

    if(user_id){
      return Session.getSession(user_id, lab_id)
      .then((session) => {
        return session.renew();
      });
    } else {
      throw new Meteor.Error("Authorization Required");
    }
  },

  'Sessions.nextTask'(lab_id){
    const user_id = Meteor.userId();

    if(user_id){
      return Session.getSession(user_id, lab_id)
      .then((session) => {
        return session.nextTask();
      })
      .then((session) => {
        return session.getJSON();
      })
    } else {
      throw new Meteor.Error("Authorization Required");
    }
  },

  'Sessions.destroy'(lab_id){
    const user_id = Meteor.userId();

    if(user_id){
      return Session.getSession(user_id, lab_id)
      .then((session) => {
        return session.destroy(SessionStatus.destroyed);
      });
    } else {
      throw new Meteor.Error("Authorization Required");
    }
  }

})
