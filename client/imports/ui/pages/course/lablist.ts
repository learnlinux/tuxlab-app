// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';

// Angular Imports
  import { Component } from '@angular/core';
  import { ROUTER_DIRECTIVES } from '@angular/router';
  
// Angular Material Imports
  import { MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS } from 'ng2-material';
  import { MdProgressBar } from '@angular2-material/progress-bar';
  
// Angular Meteor Imports
  import { MeteorComponent } from 'angular2-meteor';
  import { InjectUser } from 'angular2-meteor-accounts-ui';
  
// Import Collections
  import { course_records } from '../../../../../collections/course_records.ts';

// Inject current user into class
  @InjectUser("user")

// Define LabList Component
  @Component({
    selector: 'tuxlab-lablist',
    templateUrl: '/client/imports/ui/pages/course/lablist.html',
    directives: [
      MdProgressBar,
      MATERIAL_DIRECTIVES,
      ROUTER_DIRECTIVES
    ],
    providers: [ MATERIAL_PROVIDERS ]
  })
  
  export class LabList extends MeteorComponent {
    user: Meteor.User;
    courseId: string;
    userId: string = Meteor.userId();
    labs: Array<Object> = [];
    courseRecord;
    
    // Progress Bar Value
    public determinateValue: number = 30;
    
    constructor() {
      super(); 
      this.subscribe('course-records', [this.courseId, this.userId], () => {
        this.courseRecord = course_records.findOne({ course_id: this.courseId }); 
        if(typeof this.courseRecord !== "undefined") {
          let labs = this.courseRecord.labs;
          let totalCompleted = 0;
          let totalNumTasks = 0;
          for (let i = 0; i < labs.length; i++) {
            let lab = labs[i];
            let tasksCompleted = 0;
            let tasks = lab.tasks;
            for (let j = 0; j < tasks.length; j++) {
              let task = tasks[j];
              if (task.status === 'COMPLETED') {
                  tasksCompleted++;
              }
            }
            this.labs.push({
              'name': 'Lab ' + (i + 1).toString(),
              'completed': tasksCompleted.toString() + '/' + tasks.length.toString(),
              'date': 'soon'
            });
            totalCompleted += tasksCompleted;
            totalNumTasks += tasks.length;
          }
          this.determinateValue = (totalCompleted * 100.0) / totalNumTasks;
        }
      }, true);
    }
  }