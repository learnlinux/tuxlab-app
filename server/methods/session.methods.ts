/**
  IMPORTS
**/

import { Meteor } from 'meteor/meteor';
import { Session } from '../imports/runtime/session';
import { SessionStatus } from '../../both/models/session.model';

Meteor.methods({

  'session.getOrCreate'(user_id, lab_id){
      return Session.getSession(user_id, lab_id);
  },

  'session.renew'(user_id, lab_id){
    return Session.getSession(user_id, lab_id)
    .then((session) => {
      return session.renew();
    });
  },

  'session.nextTask'(user_id, lab_id){
    return Session.getSession(user_id, lab_id)
    .then((session) => {
      return session.nextTask();
    });
  },

  'session.destroy'(user_id, lab_id){
    return Session.getSession(user_id, lab_id)
    .then((session) => {
      return session.destroy(SessionStatus.destroyed);
    });
  }

})
