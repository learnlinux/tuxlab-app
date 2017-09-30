import { Meteor } from 'meteor/meteor';

import SetupAuthentication from "./imports/service/auth";
import { DefaultFixtures } from "../imports/test/fixtures";

// Run Authentication Services
Meteor.startup(() => {
  SetupAuthentication();
})
