
 import { Meteor } from 'meteor/meteor';

 import { DefaultFixtures, cleanupDatabase } from '../imports/fixtures'

// Load Fixtures if Development Mode
 if (Meteor.isDevelopment){
   cleanupDatabase();
   new DefaultFixtures();
 }
