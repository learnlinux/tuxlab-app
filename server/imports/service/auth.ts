
import * as _ from "lodash";

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { UserSchema } from '../../../both/schemas/user.schema';

declare var ServiceConfiguration : any;

function SetupAuthentication(){

  /*
   * Load Settings
   */
    const services = Meteor.settings['private']['oAuth'];
    if (services) {
        for (let service in services) {
            ServiceConfiguration.configurations.upsert({service: service}, {
                $set: services[service]
            });
        }
    }

  /*
   *  Schema Validation
   */
   Accounts.validateNewUser((user) => {
     UserSchema.validate(user);
     return true;
   })

  /*
   * Google Authentication
   */
   Accounts.validateNewUser(function (user) {
       if(_.has(user.services, "google") && _.has(Meteor.settings,"private.oAuth.google.domain")){
         if(user.services.google.email.endsWith(Meteor.settings['private'].oAuth.google.domain)) {
             return true;
         }
         throw new Meteor.Error(403, "You must sign in using a "+Meteor.settings['private'].oAuth.google.domain+" account");
       } else {
         return true;
       }
   });

}
export default SetupAuthentication;
