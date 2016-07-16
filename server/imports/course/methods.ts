import { Meteor } from 'meteor/meteor';
import { course_search } from './search.ts'

Meteor.methods({
  'search_courses': Meteor.wrapAsync(course_search);
});
