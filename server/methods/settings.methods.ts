import { Meteor } from 'meteor/meteor';
import { Users } from '../../both/collections/user.collection';

Meteor.methods({

  'Settings.get'(){
    if (!Meteor.userId()){
      throw new Meteor.Error("Unauthorized");
    } else if (Users.isGlobalAdministrator(Meteor.userId())){
      return Meteor.settings;
    } else {
      throw new Meteor.Error("Unauthorized");
    }
  },

  'Settings.set'({settings}){
    if (!Meteor.userId()){
      throw new Meteor.Error("Unauthorized");
    } else if (Users.isGlobalAdministrator(Meteor.userId())){
      return Meteor.settings = settings;
    } else {
      throw new Meteor.Error("Unauthorized");
    }
  }

});
