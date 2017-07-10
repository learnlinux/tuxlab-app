
 import { Meteor } from 'meteor/meteor';

 import { DefaultFixtures } from '../imports/fixtures'

// Load Fixtures if Development Mode
 if (Meteor.isDevelopment){
   new DefaultFixtures();
 }
