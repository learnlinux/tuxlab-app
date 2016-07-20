// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import { MeteorComponent } from 'angular2-meteor';
  
// Angular Imports
  import { Component } from '@angular/core';
  import { ActivatedRoute } from '@angular/router';
  
declare var Collections: any;

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
  courseRecord: any;
  grades: Array<any> = [];
  cur_user: boolean;
  
  constructor(private route: ActivatedRoute) {
    super();
    this.courseRecord = this.getCourseRecords();
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

  }

  getCourseRecords(){
    var record;
    if(this.cur_user) {
      // Student
      this.subscribe('course-records', [this.courseId, Meteor.userId()], () => {
        record = Collections.course_records.findOne({ course_id: this.courseId, user_id: Meteor.userId() });
      }, true);
      return record;
    }
    else{
      var record;
      this.subscribe('course-records', [this.courseId, this.userId], () => {
        var localCourseRecord = Collections.course_records.findOne({ course_id: this.courseId, user_id: this.userId });
        if (localCourseRecord === null || typeof localCourseRecord === "undefined") {
          // Admin
          record = Meteor.call('getUserCourseRecord', this.courseId, this.userId);
        }
        else {
          // Instructor
          record = localCourseRecord;
        }
      }, true);
      return record;
    }
  }

  ngOnInit(){
    this.userId = this.route.snapshot.params['userid'];
    this.cur_user = (typeof this.userId === "undefined" || this.userId === null);
  }
}