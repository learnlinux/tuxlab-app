
import { Meteor } from 'meteor/meteor';


// Run Authentication Services
import SetupAuthentication from "./imports/service/auth";
Meteor.startup(() => {
  SetupAuthentication();
})

// Load Fixtures if Development Mode
import { DefaultFixtures, cleanupDatabase } from '../imports/fixtures';
Meteor.startup(() => {
  if (Meteor.isDevelopment){
    cleanupDatabase();
    new DefaultFixtures();
  }
})
