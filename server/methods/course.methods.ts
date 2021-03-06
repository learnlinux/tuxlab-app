
  import { Meteor } from 'meteor/meteor';
  import * as _ from "lodash";

  import { clientConsole } from '../imports/service/console';

  import { Course, ContentPermissions } from '../../both/models/course.model';
  import { Courses } from '../../both/collections/course.collection';

  import { Lab, LabFileImportOpts } from '../../both/models/lab.model';
  import { LabRuntime } from '../../server/imports/runtime/lab_runtime';
  import { Labs } from '../../both/collections/lab.collection';

  import { Role } from '../../both/models/user.model';
  import { Users } from '../../both/collections/user.collection';

  /* PUBLICATION */

  function coursesAll(){
    if(!Meteor.userId()){
        throw new Meteor.Error("Unauthorized");
    } else if(Users.isGlobalAdministrator(Meteor.userId())) {
        return Courses.find({});
    } else {
        throw new Meteor.Error("Unauthorized");
    }
  }
  Meteor.publish('courses.all', coursesAll);

  const explore_limit = 20;
  function coursesExplore(skip){
    return Courses.find({
      "permissions.meta" : true,
      "permissions.content" : ContentPermissions.Any
    }, {
      skip : skip,
      limit: explore_limit
    });
  }
  Meteor.publish('courses.explore', coursesExplore);

  const featured_limit = 20;
  function coursesFeatured(skip){
    return Courses.find({
      "permissions.meta" : true,
      "permissions.content" : ContentPermissions.Any
    }, {
      skip : skip,
      limit: featured_limit
    });
  }
  Meteor.publish('courses.featured', coursesFeatured);

  function coursesUser(){
    if(!Meteor.userId()){
      throw new Meteor.Error("Unauthorized");
    }
    return Users.getCoursesFor(Meteor.userId());
  }
  Meteor.publish('courses.user', coursesUser);

  function coursesId(course_id){
    switch(Users.getRoleFor(course_id, Meteor.userId())){
      case Role.guest:
        return Courses.find({
          "_id" : course_id,
          "permissions.content" : ContentPermissions.Any
        });
      case Role.student:
        return Courses.find({
          "_id" : course_id,
          "permissions.content" : { "$ne" : ContentPermissions.None }
        });

      case Role.instructor:
      case Role.course_admin:
      case Role.global_admin:
        return Courses.find({ _id : course_id });
    }
  }
  Meteor.publish('courses.id', coursesId);

  /* CREATE LAB */
  export function createLab(course_id : string, lab_file : string) : Promise<any>{

    // Create Lab Runtime
    return LabRuntime.createLabRuntime({
      course_id : course_id,
      file: lab_file
    })

    // Create Lab Record
    .then((labRuntime : LabRuntime) => {
      return labRuntime._id;

    // Insert into Course Record
    }).then((lab_id) => {
      return new Promise((resolve, reject) => {
        Courses.update({
          _id: course_id
        }, {
          '$addToSet' : { labs :  lab_id }
        }, (err, res) => {
          if(err){
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    })
  }

  /* REMOVE LAB */
  export function removeLab(course_id : string, lab_id : string) : Promise<any>{
    // Remove Lab
    return new Promise((resolve, reject) => {
      Labs.remove({
        _id : lab_id
      }, (err, res) => {
        if(err){
          reject(err);
        } else {
          resolve(res);
        }
      });

    // Remove from Course Record
    }).then(() => {
        return new Promise((resolve, reject) => {
          Courses.update({
            _id: course_id
          }, {
            '$pull' : { instructors : lab_id}
          },(err, res) => {
            if(err){
              reject(err);
            } else {
              resolve(res);
            }
          });
        });
    });
  }

  export function reorderLabs(course_id : string, labs : string[]) : Promise<any>{
    return new Promise((resolve, reject) => {
      Courses.rawCollection().findAndModify({ _id : course_id, labs : { $all : labs, $size: labs.length }},{},{ $set : { labs : labs } }, (err, res) => {
        if(err){
          reject(err);
        } else if (!res.lastErrorObject.updatedExisting){
          reject(new Error("did not match course record."));
        } else {
          resolve(res);
        }
      });
    })
  }

  Meteor.methods({
    'Courses.remove'({course_id}){
      if(!Meteor.userId()){
        throw new Meteor.Error("Unauthorized");
      }

      switch(Users.getRoleFor(course_id, Meteor.userId())){
        case Role.global_admin:
          return Courses.deleteCourse(course_id);
        case Role.course_admin:
        case Role.instructor:
        case Role.student:
        case Role.guest:
          throw new Meteor.Error("Unauthorized");
      }
    },

    'Courses.search'({query}){
      // Unauthenticated
      if(!Meteor.userId()){
        return Courses.find({
          $or : [
            { "_id" : query },
            { "name" : { $regex : query, $options : 'i' }},
            { "course_number" : { $regex : query, $options : 'i' }}
          ],
          permissions: {
            content: ContentPermissions.Any,
            meta: true
          }
        }).fetch();
      }

      // Global Admin
      else if(Users.isGlobalAdministrator(Meteor.userId())){
        return Courses.find({
          $or : [
            { "_id" : query },
            { "name" : { $regex : query, $options : 'i' }},
            { "course_number" : { $regex : query, $options : 'i' }}
          ]
        }).fetch();
      }

      // Role
      else {
        return Courses.find({
          $and: [
            {
              $or : [
                { "_id" : query },
                { "name" : { $regex : query, $options : 'i' }},
                { "course_number" : { $regex : query, $options : 'i' }}
              ],
            },
            {
              $or : [

                // Any
                {
                  permissions: {
                    content: ContentPermissions.Any,
                    meta: true
                  }
                },

                // Authenticated Instructor or Course Admin
                {
                  instructors: { $elemMatch : Meteor.userId() }
                }
              ]
            }
          ]
        }).fetch();
      }


    },

    'Courses.setFeatured'({ course_id, featured }){
      if(!Meteor.userId()){
        throw new Meteor.Error("Unauthorized");
      }

      switch(Users.getRoleFor(course_id, Meteor.userId())){
        case Role.global_admin:
          return Courses.setFeatured(course_id, featured);
        case Role.course_admin:
        case Role.instructor:
        case Role.student:
        case Role.guest:
          throw new Meteor.Error("Unauthorized");
      }
    },

    'Courses.createLab'({course_id, lab_file}){
      if(!Meteor.userId()){
        throw new Meteor.Error("Unauthorized");
      }

      switch(Users.getRoleFor(course_id, Meteor.userId())){
        case Role.global_admin:
        case Role.course_admin:
          return createLab(course_id, lab_file)
          .catch((err) => {
            throw new Meteor.Error("Could Not Add Lab", "Failed to Compile", err);
          })
        case Role.instructor:
        case Role.student:
        case Role.guest:
          throw new Meteor.Error("Unauthorized");
      }
    },

    'Courses.removeLab'({course_id, lab_id}){
      if(!Meteor.userId()){
        throw new Meteor.Error("Unauthorized");
      }

      switch(Users.getRoleFor(course_id, Meteor.userId())){
        case Role.global_admin:
        case Role.course_admin:
          return removeLab(course_id, lab_id)
          .catch((err) => {
            throw new Meteor.Error("Could not remove lab.")
          })
        case Role.instructor:
        case Role.student:
        case Role.guest:
          throw new Meteor.Error("Unauthorized");
      }
    },

    'Courses.reorderLabs'({course_id, labs}){
      if(!Meteor.userId()){
        throw new Meteor.Error("Unauthorized");
      }

      switch(Users.getRoleFor(course_id, Meteor.userId())){
        case Role.global_admin:
        case Role.course_admin:
          return reorderLabs(course_id, labs)
          .catch((err) => {
            throw new Meteor.Error("Could not reorder labs.");
          });
        case Role.instructor:
        case Role.student:
        case Role.guest:
          throw new Meteor.Error("Unauthorized");
      }
    }
  })
