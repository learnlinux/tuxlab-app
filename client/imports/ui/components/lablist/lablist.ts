// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Mongo } from 'meteor/mongo';
	import 'reflect-metadata';
	import 'zone.js/dist/zone';
	
// Angular Imports 
	import { Component, ViewEncapsulation, provide } from '@angular/core';
	import { bootstrap } from 'angular2-meteor-auto-bootstrap';
	import { APP_BASE_HREF } from '@angular/common';
	import { HTTP_PROVIDERS } from '@angular/http';
	import { InjectUser } from 'angular2-meteor-accounts-ui';
		
// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MeteorComponent } from 'angular2-meteor';
	import { MdProgressBar } from '@angular2-material/progress-bar';

// Icon
  	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';
	  
// course_record database imports
    import { course_records } from '../../../../../collections/course_records';
    
@InjectUser("user")

// Define LabList Component
	@Component({
		selector: 'tuxlab-lablist',
		templateUrl: '/client/imports/ui/components/lablist/lablist.html',
		directives: [MATERIAL_DIRECTIVES,
					 MD_ICON_DIRECTIVES,
					 MdProgressBar],
		viewProviders: [MdIconRegistry],
		encapsulation: ViewEncapsulation.None
	})

// Export LabList Class 
  export class LabList extends MeteorComponent {
    user: Meteor.User;
    courseId: String;   // TODO: Get from URL
    userId: String = '1';     // TODO: Get from Meteor.userId
    labs: Array<Object> = [];
    courseRecord;

    // Progress Bar Value
    public determinateValue: number = 30;

    constructor(mdIconRegistry: MdIconRegistry) {
      super();
      // Create Icon Font
      mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
      mdIconRegistry.setDefaultFontSetClass('tuxicon');

      this.setLab(this.courseId, this.userId);
    }
		
		// Method to subscribe to course_records database and set Lab data
    setLab(courseId: String, userId: String) {
      this.subscribe('course-records', [courseId, userId], () => {
        this.courseRecord = course_records.findOne({ user_id: userId }); //TODO: add course_id
        if(this.courseRecord !== undefined) {
          let labs = this.courseRecord.labs;
          let totalCompleted = 0;
          let totalNumTasks = 0;
          for (let i = 0; i < labs.length; i++) {
            let lab = labs[i];
            let tasksCompleted = 0;
            let tasks = lab.tasks;
            for (let j = 0; j < tasks.length; j++) {
              let task = tasks[j];
              if (task.status === 'SUCCESS') {
                  tasksCompleted++;
              }
            }
            this.labs.push({
              'name': 'Lab ' + (i + 1).toString(),
              'completed': tasksCompleted.toString() + '/' + tasks.length.toString(),
              'date': lab.data.due_date
            });
            totalCompleted += tasksCompleted;
            totalNumTasks += tasks.length;
          }
          this.determinateValue = (totalCompleted * 100.0) / totalNumTasks;
        }
      }, true);
    }
		
		// Link to lab function
		toLab(lab) {
			console.log("Redirecting to " + lab + "page.");
			window.location.href = "/lab";
		}
	}
	
