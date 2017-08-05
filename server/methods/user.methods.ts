import { Meteor } from 'meteor/meteor';
import { Users } from "../../both/collections/user.collection";

Meteor.publish("userData", () => {
    return Meteor.users.find({
      _id: Meteor.userId()
    }, {
      fields: {'global_admin': 1, 'roles': 1}
    });
});
