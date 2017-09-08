
import { Meteor } from 'meteor/meteor';


// Run Authentication Services
import SetupAuthentication from "./imports/service/auth";
Meteor.startup(() => {
  SetupAuthentication();
})
