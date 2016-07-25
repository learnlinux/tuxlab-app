/**
  Tests Meteor DB Schema
**/

// Dependencies
var async = require('async');

/**
  Insert Example Data for Testing
**/
describe('Database Schema', function(){
  var server = meteor();

  // Clean Database
  it('should be clean', function(){
    return server.execute(function(){

      // Delete All Collections
      for(var index in Collections){
        Collections[index].remove({});
      }

    });
  });

  // Create Example Course
  it('should include courses', function(){
    return server.execute(function(){

      // Create Courses
      var courses = require('example_data/courses/courses.js');
      async.map(courses, function(course, callback){
        Collections.courses.insert(course, callback);
      }, function(err, results){
        expect(err).to.be.null;
      });

    });
  });

  // Create Example Labs
  it('should include labs', function(){
    return server.execute(function(){

      // Create Labs
      var labs = require('example_data/labs/labs.js');
      async.map(labs, function(lab, callback){
        Collections.courses.insert(lab, callback);
      }, function(err, results){
        expect(err).to.be.null;
      });

    });
  });

  
});
