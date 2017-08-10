
  import { Meteor } from 'meteor/meteor';
  import * as _ from "lodash";

  import { Course, ContentPermissions } from '../../both/models/course.model';
  import { Courses } from '../../both/collections/course.collection';

  import { Lab, LabFileImportOpts } from '../../both/models/lab.model';
  import { LabRuntime } from '../../server/imports/runtime/lab_runtime';
  import { Labs } from '../../both/collections/lab.collection';

  import { Role } from '../../both/models/user.model';
  import { Users } from '../../both/collections/user.collection';

  /* PUBLICATION */
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

  function coursesUser(){
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

  /* METHODS */
  export function addInstructor(course_id : string, user_id : string) {
    Courses.update({ _id: course_id }, { '$addToSet' : { instructors : user_id}});
  }

  export function removeInstructor(course_id : string, user_id : string){
    Courses.update({ _id: course_id }, { '$pull' : { instructors : user_id}});
  }

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
          '$addToSet' : { labs :  lab_id}
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
      Courses.rawCollection().findAndModify({ _id : course_id, labs : { $all : labs }},{},{ $set : { labs : labs } }, (err, res) => {
        if(err){
          reject(err);
        } else {
          resolve();
        }
      });
    })
  }

  Meteor.methods({
    'Courses.createLab'({course_id, lab_file}){
      return createLab(course_id, lab_file)
      .catch((err) => {
        throw new Meteor.Error("Could not add lab.")
      })
    },

    'Courses.removeLab'({course_id, lab_id}){
      return removeLab(course_id, lab_id)
      .catch((err) => {
        throw new Meteor.Error("Could not remove lab.")
      })
    },

    'Courses.reorderLabs'({course_id, labs}){
      return reorderLabs(course_id, labs)
      .catch((err) => {
        throw new Meteor.Error("Could not reorder labs.");
      });
    }
  })
