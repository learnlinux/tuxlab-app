/**
  Collection Test
  Tests collection functions
**/

  import { Meteor } from 'meteor/meteor';

  // Import Collection Objects
  import { CourseRecords } from '../both/collections/course_record.collection';
  import { Courses } from '../both/collections/course.collection';
  import { Labs } from '../both/collections/lab.collection';
  import { Sessions } from '../both/collections/session.collection';
  import { Users } from '../both/collections/user.collection';

  // Import Collection Models
  import { CourseRecord } from '../both/models/course_record.model';
  import { Course, ContentPermissions, EnrollPermissions } from '../both/models/course.model';
  import { Lab } from '../both/models/lab.model';
  import { Session } from '../both/models/session.model';
  import { User, Role } from '../both/models/user.model';

  export let example_records = {
    global_admin : {
      _id : "",
      profile: {
        name : "Derek Brown",
        organization : "Carnegie Mellon University",
        email : "derek@example.org",
        picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
      },
      roles: {
        global_admin: true,
        administrator: [],
        instructor: [],
        student: []
      }
    },
    course_admin : {
      _id : "",
      profile: {
        name : "Aaron Mortenson",
        organization : "Carnegie Mellon University",
        email : "aaron@example.org",
        picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
      },
      roles: {
        global_admin: false,
        administrator: [],
        instructor: [],
        student: []
      }
    },
    instructor : {
      _id : "",
      profile: {
        name : "Sander Shi",
        organization : "Carnegie Mellon University",
        email : "sander@example.org",
        picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
      },
      roles: {
        global_admin: false,
        administrator: [],
        instructor: [],
        student: []
      }
    },
    student : {
      _id : "",
      profile: {
        name : "Cem Ersoz",
        organization : "Carnegie Mellon University",
        email : "cem@example.org",
        picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
      },
      roles: {
        global_admin: false,
        administrator: [],
        instructor: [],
        student: []
      }
    },
    course : {
      _id: "",
      course_name: "Great Practical Ideas for Computer Scientists",
      course_number: "15-131",
      course_description: {
        content: "Some stuff about content of the course.  HTML allowed.",
        syllabus: "Some stuff about the syllabus.  Markdown allowed."
      },
      featured: false,
      labs: [],
      administrators: [],
      instructors: [],
      permissions: {
        meta: true,
        content: ContentPermissions.Any,
        enroll: EnrollPermissions.Any
      }
    },
    lab : {

    },
    session : {

    }
  }

  export function createTestCollections(){

    it('should contain no extraneous records', function(){
      CourseRecords.remove({});
      Courses.remove({});
      Labs.remove({});
      Sessions.remove({});
      Users.remove({});
    });

    it ('should contain example global admin', function(){
      Users.insert(example_records.global_admin, function(err, user_id){
        err.should.be.undefined;
        example_records.global_admin._id = user_id;
      });
    });

    it ('should contain example course admin', function(){
      Users.insert(example_records.course_admin, function(err, user_id){
        err.should.be.undefined;
        example_records.course_admin._id = user_id;
      });
    });

    it ('should contain example instructor', function(){
      Users.insert(example_records.instructor, function(err, user_id){
        err.should.be.undefined;
        example_records.instructor._id = user_id;
      });
    });

    it ('should contain example student', function(){
      Users.insert(example_records.student, function(err, user_id){
        err.should.be.undefined;
        example_records.student._id = user_id;
      });
    });

    it ('should contain example course', function(){
      Courses.insert(example_records.course, function(err, course_id){
        err.should.be.undefined;
        example_records.course._id = course_id;
      });
    });

    /*
    it ('should contain example lab', function(){
      Labs.insert(example_records.lab, function(err, lab_id){
        err.should.be.undefined;
        example_records.lab._id = lab_id;
      });
    });


    it ('should contain example course records', function(){
      let users = ['global_admin', 'course_admin', 'instructor', 'student'];

      users.forEach(function(user){
        let course_record : CourseRecord = {

        }

        CourseRecords.insert(course_record, function(err, course_record_id){
          err.should.be.undefined;
        });
      });
    });
 */
  }


  if (Meteor.isServer){
    describe('Create Example Data',createTestCollections);
  }
