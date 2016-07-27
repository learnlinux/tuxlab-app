/**
  Tests Meteor DB Schema
**/

// Dependencies
var async = require('async');

//example databases
var labs_good_1 = require('./example_data/labs/labs.good.js');
var labs_bad_1 =  require('./example_data/labs/labs.bad.js');

var courses_good_1 = require('./example_data/courses/courses.js');
var courses_bad_1 = require('./example_data/courses/courses.bad.1.js');
var users = require('./example_data/users/users.js');

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
  
  //Create Example Users
  it('should include users', function(){
    return server.execute(function(users){
	    
      async.map(users, function(user, callback){
        Meteor.users.insert(user, callback);
      }, function(err,res){
        expect(err).to.be.null;
      });
    },[users]);
  });

  // Create Example Courses
  it('should include courses', function(){
    return server.execute(function(courses){
       async.map(courses, function(course, callback){
        Collections.courses.insert(course, callback);
      }, function(err, results){
        expect(err).to.be.null;
      });

    },[courses_good_1]);
  });

  it('should reject courses with invalid instructors', function(){
    return server.execute(function(courses){
      async.map(courses, function(course, callback){
        Collections.courses.insert(course, callback);
        },function(err,results){
	  expect(err).to.not.be.null;
	});
    },[courses_bad_1]);
  });

  // Create Example Labs
  it('should include labs', function(){
    return server.execute(function(labs){

      // Create Labs
      async.map(labs, function(lab, callback){
        Collections.labs.insert(lab, callback);
      }, function(err, results){
        expect(err).to.be.null;
	expect(results).to.not.be.false;
      });

    },[labs_good_1]);
  });

  it('should not include bad labs', function(){
    return server.execute(function(labs){
      
      async.map(labs, function(lab, callback){
        Collections.labs.insert(lab, callback);
      },function(err,results){
        expect(err).to.not.be.null;
      });
    },[labs_bad_1]);
  });
  
  it('should not include labs', function(){
    return server.execute(function(labs){
    
      // Create Labs
      async.map(labs, function(lab, callback){
        Collections.labs.insert(lab, callback);
      }, function(err, results){
        expect(err).to.not.be.null;
	expect(results).to.not.be.true;
      });
    },[labs_bad_1]);
  });
});
