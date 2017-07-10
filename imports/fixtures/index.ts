/**
 **  TuxLab App Fixtures
 **  Creates Example Databases for Testing Purposes
 **/

 // Imports
 import { Meteor } from 'meteor/meteor';
 import { Factory } from 'meteor/dburles:factory';

 // Collections Objects
 import { Sessions } from '../../both/collections/session.collection';

 import { CourseRecords } from '../../both/collections/course_record.collection';

 import { Course, ContentPermissions, EnrollPermissions } from '../../both/models/course.model';
 import { Courses } from '../../both/collections/course.collection';

 import { Lab, LabStatus } from '../../both/models/lab.model';
 import { Labs } from '../../both/collections/lab.collection';

 import { User, Role } from '../../both/models/user.model';
 import { Users } from '../../both/collections/user.collection';


 /*
  * cleanupDatabase
  * cleans up databases
  */
  export function cleanupDatabase(){
    CourseRecords.remove({});
    Courses.remove({});
    Labs.remove({});
    Sessions.remove({});
    Users.remove({});
  }

 /*
  * createDefaultFixtures
  * checks if databases are empty.  If they are, loads
  * the database fixtures.
  */
 export function createDefaultFixtures(){

   console.log("Creating Default Fixtures");

   // Users
     Factory.define<User>('users/global_admin', Users, {
       profile: {
         name : "Derek Brown",
         organization : "Carnegie Mellon University",
         email : "derek@example.org",
         picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
       },
       global_admin: true,
       roles: []
     });
     Factory.create('users/global_admin');

     Factory.define<User>('users/course_admin', Users, {
       profile: {
         name : "Aaron Mortenson",
         organization : "Carnegie Mellon University",
         email : "aaron@example.org",
         picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
       },
       global_admin: false,
       roles: []
     });
     Factory.create('users/course_admin');

     Factory.define<User>('users/instructor', Users, {
       profile: {
         name : "Sander Shi",
         organization : "Carnegie Mellon University",
         email : "sander@example.org",
         picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
       },
       global_admin: false,
       roles: []
     });
     Factory.create('users/instructor');

     Factory.define<User>('users/student', Users, {
       profile: {
         name : "Cem Ersoz",
         organization : "Carnegie Mellon University",
         email : "cem@example.org",
         picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
       },
       global_admin: false,
       roles: []
     });
     Factory.create('users/student');

     // Course
     Factory.define<Course>('courses/gpi', Courses, {
       course_name: "Great Practical Ideas for Computer Scientists",
       course_number: "15-131",
       course_description: {
         content: "Some stuff about content of the course.  Markdown allowed.",
         syllabus: "Some stuff about the syllabus.  Markdown allowed."
       },
       featured: false,
       labs: [
       ],
       instructors: [
       ],
       permissions: {
         meta: true,
         content: ContentPermissions.Any,
         enroll: EnrollPermissions.Any
       }
     });
     Factory.create('courses/gpi');

     // Lab
     Factory.define<Lab>('labs/intro_git', Labs, {
       name: "Getting Started with Git",
       description: "Learn basics of Git with GitHub",
       course_id: Factory.get('courses/gpi'),
       updated: Date.now(),
       status: LabStatus.closed,
       file: "Lab = new TuxLab({name : 'GitHub Lab',description: 'Teaches users how to clone a repository.', vm: 'alpine'});",
       tasks: []
     });
     Factory.create('labs/intro_git');

 }
