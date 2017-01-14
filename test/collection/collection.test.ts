/**
  Collection Test
  Tests collection functions
**/

  import { Meteor } from 'meteor/meteor';
  import { expect } from 'chai';
  import * as _ from "underscore";

  // Import Collection Objects
  import { CourseRecords } from '../../both/collections/course_record.collection';
  import { Courses } from '../../both/collections/course.collection';
  import { Labs } from '../../both/collections/lab.collection';
  import { Sessions } from '../../both/collections/session.collection';
  import { Users } from '../../both/collections/user.collection';

  // Import Collection Models
  import { CourseRecord } from '../../both/models/course_record.model';
  import { Course, ContentPermissions, EnrollPermissions } from '../../both/models/course.model';
  import { Lab, LabStatus } from '../../both/models/lab.model';
  import { Session } from '../../both/models/session.model';
  import { User, Role } from '../../both/models/user.model';

  export let example_records = {
    global_admin : {
      _id : "",
      profile: {
        name : "Derek Brown",
        organization : "Carnegie Mellon University",
        email : "derek@example.org",
        picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
      },
      global_admin: true,
      roles: []
    },
    course_admin : {
      _id : "",
      profile: {
        name : "Aaron Mortenson",
        organization : "Carnegie Mellon University",
        email : "aaron@example.org",
        picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
      },
      global_admin: false,
      roles: []
    },
    instructor : {
      _id : "",
      profile: {
        name : "Sander Shi",
        organization : "Carnegie Mellon University",
        email : "sander@example.org",
        picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
      },
      global_admin: false,
      roles: []
    },
    student : {
      _id : "",
      profile: {
        name : "Cem Ersoz",
        organization : "Carnegie Mellon University",
        email : "cem@example.org",
        picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
      },
      global_admin: false,
      roles: []
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
      instructors: [],
      permissions: {
        meta: true,
        content: ContentPermissions.Any,
        enroll: EnrollPermissions.Any
      }
    },
    lab : {
      _id: "",
      name: "Gitting Started with Git",
      description: "Learn basics of Git with GitHub",
      course_id: "",
      updated: Date.now(),
      status: LabStatus.closed,
      file: "Lab = new TuxLab({name : 'GitHub Lab',description: 'Teaches users how to clone a repository.', vm: 'alpine'});",
      tasks: []
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

    it ('should contain example course', function(done){
      Courses.insert(example_records.course, function(err, course_id){
        expect(err).to.not.exist;
        example_records.course._id = course_id;
        done();
      });
    });

    it ('should contain example lab', function(done){
      example_records.lab.course_id = example_records.course._id;

      Labs.insert(example_records.lab, function(err, lab_id){
        expect(err).to.not.exist;
        example_records.lab._id = lab_id;
        done();
      });
    });

    it ('should contain example users', function(done){
      let users = ['global_admin', 'course_admin', 'instructor', 'student'];

      users.forEach(function(user){
        example_records[user]._id =  Users.insert(example_records[user])
        expect(example_records[user]._id).to.be.a('string');
      });
      done();
    });

    it ('should allow setting user roles', function(done){
      let users = ['course_admin', 'instructor', 'student'];

      users.forEach(function(user){
        Users.setRoleFor(example_records.course._id, example_records[user]._id, Role[user]);
      });
      done();
    });

    it ('should allow getting user roles', function(done){
      let roles = ['global_admin', 'course_admin', 'instructor', 'student'];

      roles.forEach(function(user){
        expect(Users.getRoleFor(example_records.course._id, example_records[user]._id)).to.be.equal(Role[user]);
      });
      done();
    });

  }


  if (Meteor.isServer){
    describe('Create Example Data',createTestCollections);
  }
