// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import { MeteorComponent } from 'angular2-meteor';
  
// Angular Imports
  import { Component } from '@angular/core';
  
// Collection Imports
  import { course_records } from '../../../../../collections/course_records.ts';

// Define Grades Component
@Component({
  selector: 'tuxlab-gradelist',
  templateUrl: '/client/imports/ui/pages/course/gradelist.html'
})

// Export Grades Class 
export class GradeList extends MeteorComponent{
  user: Meteor.User;
  userId: string;
  courseId: string;
  courseRecord;
  grades: Array<any> = [];
  constructor() {
    super();
    this.subscribe('course-records', [this.courseId, this.userId], () => {
      this.courseRecord = course_records.findOne({ course_id: this.courseId });
      if (this.courseRecord !== undefined) {
        let labs = this.courseRecord.labs;
        let totalEarned = 0;
        let totalFull = 0;
        for (let i = 0; i < labs.length; i++) {
          let lab = labs[i];
          let tasks = lab.tasks;
          for (let j = 0; j < tasks.length; j++) {
            let task = tasks[j];
            totalEarned += task.grade.earned;
            totalFull += task.grade.total;
            this.grades.push({
              'name': 'lab ' + (i + 1).toString() + ' task ' + (j + 1).toString(),
              'grade': ((task.grade.earned * 100.0) / task.grade.total).toString() + '%'
            });
          }
        }
        this.grades.push({
          'name': 'Course Average',
          'grade': ((totalEarned * 100.0) / totalFull).toString() + '%'
        });
      }
    }, true);
  }


}