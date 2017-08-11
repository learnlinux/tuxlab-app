import { Meteor } from 'meteor/meteor';
import { Users } from "../../both/collections/user.collection";

import { Courses } from '../../both/collections/course.collection';

Meteor.publish("userData", () => {
    return Meteor.users.find({
      _id: Meteor.userId()
    }, {
      fields: {'global_admin': 1, 'roles': 1}
    });
});

Meteor.publish("user.instructors", (course_id) => {
  var course = Courses.findOne({ _id : course_id });

  if(course){
    return Users.find({
      _id : { $in : course.instructors }
    },{
      fields: { "_id" : 1, "profile.name" : 1 }
    });
  } else {
    throw new Meteor.Error("Could not find course");
  }

})
