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

  // Create Example Course
  it('should have example course', function(){

    var example_course = {
      course_number: "15-131",
      course_name: "Great Practical Ideas for Computer Scientists",
      instructor_name: "Tom Cortina",
      labs: []
    }

    return server.execute(function(example_course){
      Collections.courses.insert(example_course);
    }, [example_course]);

  });

  // Create Example Lab
  it('should have example lab', function(){
    var example_lab = {
      _id : "574467bc11091623418a429d",
      course_id : "574465a21109160b518a4299",
      lab_name: "Getting Started with Git",
      file: require('fs').readFileSync('./tests/example_data/labfile1.js', "utf8").toString(),
      tasks: [
        {
          _id: 1,
          name: "Git Clone",
          md: "##################"
        },
        {
          _id: 2,
          name: "Git Pull",
          md: "##################"
        }
      ]
    }

    return server.execute(function(example_lab){
      Collections.labs.insert(example_lab);
    }, [example_lab]);

  });

  // Inject Lab into Course


});
