var async = require ('async');
var future = require('fibers/future');
import { courses } from '../../../collections/courses.ts';

Meteor.methods({
  'search_courses': function(text : string, results_per_page : number, page_no : number) {
    let search_pattern = new RegExp(text, "i");
    if(results_per_page <= 0 || results_per_page > 200) {
      results_per_page = 200;
    }
    return courses.find({
      $and: [
        { hidden: false },
        {
          $or: [
            { course_number: search_pattern },
            { $where: "this.course_number.replace(/[ .-]/g,'') == '"+text+"'" },
            { course_name: search_pattern }
          ]
        }
      ]
    }, {
      limit: results_per_page,
      skip: (page_no - 1) * results_per_page
    }).fetch();
    
    /*
    let search_options = {
      limit: results_per_page, 
      skip: [ results_per_page, page_no ],
      fields: {
        course_number: 1,
        course_name: 1,
        course_description: 1,
        instructor_name: 1
      }
    };
    let result = new future();
    async.parallel({
      "course_count": function(callback) {
        callback(null, courses.find(search_object).count());
      },
      "course_results": function(callback) {
        callback(null, courses.find(search_object, search_options).fetch());
      }
    }, function(err, res) {
      if(err) {
        res.throw(err);
      }
      else {
        res.return(res);
      }
    });
    return result.wait();
    */
  }
});
