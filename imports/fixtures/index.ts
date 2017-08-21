/**
 **  TuxLab App Fixtures
 **  Creates Example Databases for Testing Purposes
 **/

 // Imports
 import * as _ from "lodash";
 import { Meteor } from 'meteor/meteor';

 // Collections Objects
 import { Sessions } from '../../both/collections/session.collection';

 import { CourseRecords } from '../../both/collections/course_record.collection';

 import { Course, ContentPermissions, EnrollPermissions } from '../../both/models/course.model';
 import { Courses } from '../../both/collections/course.collection';
 import { createLab } from '../../server/methods/course.methods';

 import { Lab, LabStatus } from '../../both/models/lab.model';
 import { Labs } from '../../both/collections/lab.collection';
 import { Example1 } from "./example_labs";

 import { User, Role } from '../../both/models/user.model';
 import { Users } from '../../both/collections/user.collection';
 import { addRoleForCourse } from '../../server/methods/user.methods';


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

     // Users
     this.users = {
       "global_admin": Users.insert({
                            username: "global_admin",
                            profile: {
                                  name : "Derek Brown",
                                  organization : "Carnegie Mellon University",
                                  email : "derek@example.org",
                                  picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
                            },
                            global_admin: true,
                            roles: []
                         }),

       "course_admin":  Users.insert({
                          username: "course_admin",
                          profile: {
                            name : "Aaron Mortenson",
                            organization : "Carnegie Mellon University",
                            email : "aaron@example.org",
                            picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
                          },
                          global_admin: false,
                          roles: []
                        }),

        "instructor": Users.insert({
                          username: "instructor",
                          profile: {
                            name : "Sander Shi",
                            organization : "Carnegie Mellon University",
                            email : "sander@example.org",
                            picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
                          },
                          global_admin: false,
                          roles: []
                        }),

         "student":  Users.insert({
                        username: "student",
                        profile: {
                          name : "Cem Ersoz",
                          organization : "Carnegie Mellon University",
                          email : "cem@example.org",
                          picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
                        },
                        global_admin: false,
                        roles: []
                     })
     };
     Accounts.setPassword(this.users["global_admin"], "global_admin");
     Accounts.setPassword(this.users["course_admin"], "course_admin");
     Accounts.setPassword(this.users["instructor"], "instructor");
     Accounts.setPassword(this.users["student"], "student");


     // Courses
     this.courses = ({
       "gpi" : Courses.insert({
                   name: "Great Practical Ideas for Computer Scientists",
                   course_number: "15-131",
                   description: {
                     content: "Some stuff about content of the course.  Markdown allowed.",
                     syllabus: "Some stuff about the syllabus.  Markdown allowed."
                   },
                   featured: false,
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

   public destructor(){

     // Delete Users
     _.forEach(this.users, function(value, key){
       Users.remove({ '_id' : value });
     })

     // Delete Courses
     _.forEach(this.courses, function(value, key){
       Courses.remove({ '_id' : value });
     })

     // Delete Labs
     _.forEach(this.labs, function(value, key){
       Labs.remove({ '_id' : value });
     })
   }
 }
