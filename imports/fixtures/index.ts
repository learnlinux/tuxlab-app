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

 import { Lab, LabStatus } from '../../both/models/lab.model';
 import { Labs } from '../../both/collections/lab.collection';

 import { User, Role } from '../../both/models/user.model';
 import { Users } from '../../both/collections/user.collection';

 import { Example1 } from "./example_labs";

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
     "gpi/git" : string
   }

   constructor(){

     // Users
     this.users = {
       "global_admin": Users.insert({
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

     // Courses
     this.courses = ({
       "gpi" : Courses.insert({
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
        })
     };
     Courses.addLab(this.courses['gpi'], this.labs['gpi/git']);
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
