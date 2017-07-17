/**
  IMPORTS
**/

import { Meteor } from 'meteor/meteor';
import { Session } from '../../server/imports/runtime/session';

Meteor.methods({

  'session.getOrCreate'({ user_id, lab_id }){

    // Run Async Function
    Meteor.wrapAsync(function(cb){
      Session.getSession(user_id, lab_id)
        .then(function(res){
          cb(null, res);
        })
        .catch(function(err){
          cb(err);
        });
    });
  },

  'session.renew'({ session_id }){

  },


  'session.nextTask'({ session_id }){

  },

  'session.destroy'({ session_id }){

  }

})
