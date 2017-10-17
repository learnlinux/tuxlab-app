import * as _ from "lodash";
import { Meteor } from 'meteor/meteor';

import SetupAuthentication from "./imports/service/auth";
import { DefaultFixtures } from "../imports/test/fixtures";

// Run Authentication Services
Meteor.startup(() => {
  SetupAuthentication();
})

// Enable Fixtures if Defined
if(_.has(process.env, "TUXLAB_FIXTURES") &&
   typeof process.env["TUXLAB_FIXTURES"] === "string" &&
   process.env["TUXLAB_FIXTURES"].toUpperCase() === "TRUE"){
   new DefaultFixtures();
}
