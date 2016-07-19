import { Meteor } from 'meteor/meteor';
import { course_search } from './search.ts'

Meteor.methods({
  'search_courses': function(text: string, results_per_page: number, page_no: number) {
    var courseAsync = Meteor.wrapAsync(course_search);
    var result;
    var error;
    courseAsync(text, results_per_page, page_no, function(res, err) {
      if(err) {
        result = null;
        error = err;
      }
      else {
        result = res;
        error = null;
      }
    });
    if(error) {
      throw new Meteor.Error("Search Error");
    }
    else {
      return result;
    }
  }
});