// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import { MeteorComponent } from 'angular2-meteor';
  
// Angular Imports
  import { Component } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  
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
  
  constructor(private route: ActivatedRoute, private router: Router) {
    super();
  }
  
  setGrades() {
    if (this.courseRecord !== undefined) {
      let labs = this.courseRecord.labs;
      let totalEarned = 0;
      let totalFull = 0;
      for (let i = 0; i < labs.length; i++) {
        let lab = labs[i];
        let tasks = lab.tasks;
        for (let j = 0; j < tasks.length; j++) {
          let task = tasks[j];
          totalEarned += task.grade[0];
          totalFull += task.grade[1];
          this.grades.push({
            'name': 'lab ' + (i + 1).toString() + ' task ' + (j + 1).toString(),
            'grade': ((task.grade[0] * 100.0) / task.grade[1]).toString() + '%'
          });
        }
      }
      let courseAverage;
      if (totalFull !== 0) {
        courseAverage = ((totalEarned * 100.0) / totalFull).toString() + "%";
      }
      else {
        courseAverage = "N/A";
      }
      this.grades.push({
        'name': 'Course Average',
        'grade': courseAverage
      });
    }  
  }
  
  getCourseRecords(){
    this.subscribe('course-records', () => {
      this.autorun(() => {
        if(this.cur_user) {
          // Student 
          this.courseRecord = Collections.course_records.findOne({ course_id: this.courseId, user_id: Meteor.userId() });
        }
        else {
          var localCourseRecord = Collections.course_records.findOne({ course_id: this.courseId, user_id: this.userId });
          if(localCourseRecord === null || typeof localCourseRecord === "undefined") {
            // Admin 
            this.courseRecord = Meteor.call('getUserCourseRecord', this.courseId, this.userId);
          }
          else {
            // Instructor
            this.courseRecord = localCourseRecord;
          }
        }
        this.setGrades();
      });
    }, true);
  }

  ngOnInit(){
    this.userId = this.router.routerState.parent(this.route).snapshot.params['userid'];
    this.courseId = this.router.routerState.parent(this.route).snapshot.params['courseid'];
    this.cur_user = (typeof this.userId === "undefined" || this.userId === null);
    this.getCourseRecords();
  }
}