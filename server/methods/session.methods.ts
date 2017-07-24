/**
  IMPORTS
**/

import { Meteor } from 'meteor/meteor';
import { Session } from '../imports/runtime/session';
import { SessionStatus } from '../../both/models/session.model';

Meteor.methods({

  'session.getOrCreate'(lab_id){
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

  'session.renew'(lab_id){
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

  'session.nextTask'(lab_id){
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

  'session.destroy'(lab_id){
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
