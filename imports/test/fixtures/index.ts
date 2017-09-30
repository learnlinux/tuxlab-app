/**
 **  TuxLab App Fixtures
 **  Creates Example Databases for Testing Purposes
 **/

 // Imports
 import * as _ from "lodash";
 import { Meteor } from 'meteor/meteor';
 import { Accounts } from 'meteor/accounts-base';

 // Collections Objects
 import { Sessions } from '../../../both/collections/session.collection';

 import { CourseRecords } from '../../../both/collections/course_record.collection';

 import { Course, ContentPermissions, EnrollPermissions } from '../../../both/models/course.model';
 import { Courses } from '../../../both/collections/course.collection';
 import { createLab } from '../../../server/methods/course.methods';

 import { Lab, LabStatus } from '../../../both/models/lab.model';
 import { Labs } from '../../../both/collections/lab.collection';
 import { Example1 } from "./example_labs";

 import { User, Role } from '../../../both/models/user.model';
 import { Users } from '../../../both/collections/user.collection';
 import { addRoleForCourse } from '../../../server/methods/user.methods';

 /*
  * defaultFixtures
  */
 export class DefaultFixtures{
   public users : {
     "global_admin" : string,
     "course_admin" : string,
     "instructor" : string,
     "student" : string
   };

   public courses : {
     "gpi" : string
   };

   public labs : {
     "gpi/git" : string;
     "gpi/apache" : string;
   }

   constructor(){

     // Reset Database
     CourseRecords.remove({});
     Courses.remove({});
     Labs.remove({});
     Sessions.remove({});
     Users.remove({});

     // Users
     this.users = {
       global_admin : <string> Accounts.createUser({
         username: "global_admin",
         email: "global-admin@andrew.cmu.edu",
         password: "global_admin",
         profile: {
           name : "Global Admin",
           organization : "Carnegie Mellon University",
           picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
         }
       }),

       course_admin : <string> Accounts.createUser({
         username: "course_admin",
         email: "course-admin@andrew.cmu.edu",
         password: "course_admin",
         profile: {
           name : "Course Admin",
           organization : "Carnegie Mellon University",
           picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
         }
       }),

       instructor : <string> Accounts.createUser({
         username: "instructor",
         email: "instructor@andrew.cmu.edu",
         password: "instructor",
         profile: {
           name : "Instructor",
           organization : "Carnegie Mellon University",
           picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
         }
       }),

       student : <string> Accounts.createUser({
         username: "student",
         email: "student@andrew.cmu.edu",
         password: "student",
         profile: {
           name : "Student",
           organization : "Carnegie Mellon University",
           picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
         }
       })
     }
     Users.setGlobalAdministrator(this.users.global_admin, true);

     // Courses
     this.courses = ({
       "gpi" : Courses.insert({
                   name: "Great Practical Ideas for Computer Scientists",
                   course_number: "15-131",
                   description: {
                     content: "Some stuff about content of the course.  Markdown allowed.",
                     syllabus: "Some stuff about the syllabus.  Markdown allowed."
                   },
                   featured: true,
                   labs: [
                   ],
                   instructors: [],
                   permissions: {
                     meta: true,
                     content: ContentPermissions.Any,
                     enroll: EnrollPermissions.Any
                   }
                 })
     });

     // Labs
     this.labs = {
       "gpi/git" :  Labs.insert({
          name: "Getting Started with Git",
          description: "Learn basics of Git with GitHub",
          course_id: this.courses.gpi,
          updated: Date.now(),
          status: LabStatus.closed,
          file: Example1,
          tasks: [
            {
              name : "Git Init",
              md: "This is some markdown."
            },
            {
              name : "Git Pull",
              md: "This is also some markdown."
            }
          ]
        }),
       "gpi/apache" :  Labs.insert({
          name: "Getting Started with Apache",
          description: "Learn basics of Git with Apache",
          course_id: this.courses.gpi,
          updated: Date.now(),
          status: LabStatus.closed,
          file: Example1,
          tasks: [
            {
              name : "Git Init",
              md: "This is some markdown."
            },
            {
              name : "Git Pull",
              md: "This is also some markdown."
            }
          ]
        })
     };

     // Add Labs to Courses
     Courses.update({ _id : this.courses.gpi }, { $set : { labs : [this.labs["gpi/git"], this.labs["gpi/apache"]]}});

     // Add Instructors to Courses
     addRoleForCourse(this.courses.gpi, this.users.course_admin, Role.course_admin);
     addRoleForCourse(this.courses.gpi, this.users.instructor, Role.instructor);

   }
 }
