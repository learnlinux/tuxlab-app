/**
  Tests Meteor DB Authentication Roles and Inserts Example data for Later Use
**/

/**
  Test Client-Side Insertion
**/

/**
  Test Schema Enforcement
**/

/**
  Insert Example Data for Testing
**/
describe('Setup Example Database', function(){
  var server = meteor();

  // Clean Database
  it('should be clean', function(){
    return server.execute(function(){
      // Delete All Collections
      var collections = [new Mongo.Collection('users'), new Mongo.Collection('courses'), new Mongo.Collection('course_records')];
      for (var i = 0; i < collections.length; i++){
        collections[i].remove({});
      }
    });
  });

  // Create Some Courses
  it('should have courses', function(){
    return server.execute(function(){
    });
  });


});
