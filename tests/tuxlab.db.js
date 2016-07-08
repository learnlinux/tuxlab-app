/**
  Tests Meteor DB Authentication Roles and Inserts Example data for Later Use
**/

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
  var course_id;
  it('should include courses', function(){
    return server.promise(function(resolve, reject){
      var example_course = {
        course_number: "15-131",
        course_name: "Great Practical Ideas for Computer Scientists",
        instructor_name: "Tom Cortina",
        labs: []
      }

      Collections.courses.insert(example_course, function(err, id){
        if(err){
          reject(err);
        }
        else{
          resolve(id);
        }
      });
    }).then(function(id){
      course_id = id;
    });
  });

  // Create Example Lab
  var lab_id;
  it('should include labs', function(){

    var labfile = require('fs').readFileSync('./tests/example_data/labfile1.js', "utf8").toString();

    return server.promise(function(resolve, reject, labfile, course_id){
      var example_lab = {
        _id : "574467bc11091623418a429d",
        course_id : course_id,
        lab_name: "Getting Started with Git",
        file: labfile,
        tasks: [
          {
            _id: 1,
	    updated: 1467995862937,
            name: "Git Clone",
            md: "##################"
          },
          {
            _id: 2,
	    updated: 1467995862937,
            name: "Git Pull",
            md: "##################"
          }
        ]
      }

      Collections.labs.insert(example_lab, function(err, id){
        if(err){
          reject(err);
        }
        else{
          resolve(id);
        }
      });
    }, [labfile, course_id]).then(function(id){
      lab_id = id;
    });
  });

  // Validate that Records Exists
  it('should be accepted by database', function(){
    return server.execute(function(course_id, lab_id){
      var course = Collections.courses.findOne(course_id);

          // Check Lab Injection
          expect(course).to.have.property('labs');
          expect(course.labs).to.include(lab_id);

      var lab = Collections.labs.findOne(lab_id);

          // Confirm LabFile verifications were run

    }, [course_id, lab_id]);
  });
});

/**
  Test Client-Side Insertion
**/
describe('Client-Side Insertion', function(){

});



/**
  Test Schema Enforcement
**/
