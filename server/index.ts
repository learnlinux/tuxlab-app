import { Meteor } from 'meteor/meteor';

// Load Fixtures if Development Mode
 import { DefaultFixtures, cleanupDatabase } from '../imports/fixtures';

 if (Meteor.isDevelopment){
   cleanupDatabase();
   new DefaultFixtures();
 }
