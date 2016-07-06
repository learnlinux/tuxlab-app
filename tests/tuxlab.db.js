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
      for(var index in Collections){
        Collections[index].remove({});
      }

    });
  });

  // Create Some Courses
  it('should have courses', function(){

    var example_course = require('./example_data/example_course.js');

    return server.execute(function(example_course){
      Collections.courses.insert(example_course);
    }, [example_course]);
  });


});
