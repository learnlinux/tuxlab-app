import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

import {Roles} from './user.ts';

export const course_records = new Mongo.Collection('course_records');

course_records.allow({
  insert: function (userid, doc : any) {
    if (typeof doc.course_id !== "undefined"){
      return Roles.isInstructorFor(doc.course_id) || Roles.isAdministratorFor(doc.course_id);
    }
    else{
      return false;
    }
  },
  update: function (userid, doc : any, fields : any) {
    if( typeof doc.course_id !== "undefined" ){
      return Roles.isInstructorFor(doc.course_id) || Roles.isAdministratorFor(doc.course_id);
    }
    else{
      return false;
    }
  },
  remove: function(userid, doc : any) {
    return (typeof doc.course_id !== "undefined" && Roles.isAdministratorFor(doc.course_id));
  }
});
