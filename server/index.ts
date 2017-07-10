
 import { Meteor } from 'meteor/meteor';

 import { createDefaultFixtures } from "../imports/fixtures";

// Load Fixtures if Development Mode
 if (Meteor.isDevelopment){
   createDefaultFixtures();
 }
