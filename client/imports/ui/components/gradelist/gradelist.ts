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
	
// Icon
  	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';
	
// Course Records Import
	import { course_records } from '../../../../../collections/course_records';
	
@InjectUser("user")

// Define Grades Component
	@Component({
		selector: 'tuxlab-gradelist',
		templateUrl: '/client/imports/ui/components/gradelist/gradelist.html',
		directives: [MATERIAL_DIRECTIVES,
					 MD_ICON_DIRECTIVES],
		viewProviders: [MdIconRegistry],
		encapsulation: ViewEncapsulation.None
	})

// Export Grades Class 
    export class GradeList extends MeteorComponent{
        user: Meteor.User;

        // Used to locate course record
        userId: String = '1'; // TODO: Get from user
        courseId: String;	  // TODO: Get from URL

        courseRecord;
        grades: Array<any> = [];

        constructor(mdIconRegistry: MdIconRegistry) {
            super();
            // Create Icon Font
            mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
            mdIconRegistry.setDefaultFontSetClass('tuxicon');
            
            this.setGrades(this.courseId, this.userId);
        }
        // Method to Subscribe course_records database and set grades
        setGrades(courseId: String, userId: String) {
            this.subscribe('course-records', [userId, courseId], () => {
                this.courseRecord = course_records.findOne({ user_id: userId }); //TODO: add course_id
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

