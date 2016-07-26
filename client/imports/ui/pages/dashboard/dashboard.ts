// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Mongo }       from 'meteor/mongo';
	import { MeteorComponent } from 'angular2-meteor';
	import 'reflect-metadata';
	import 'zone.js/dist/zone';

// Angular Imports
	import { Component, ViewEncapsulation, provide } from '@angular/core';
	import { bootstrap } from 'angular2-meteor-auto-bootstrap';
	import { APP_BASE_HREF } from '@angular/common';
	import { HTTP_PROVIDERS } from '@angular/http';
	import { InjectUser } from 'angular2-meteor-accounts-ui';
	import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';

// Icon
	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// Collections
  import { courses } from '../../../../../collections/courses.ts';
  import { course_records } from '../../../../../collections/course_records.ts';


// Define Dashboard Component
@Component({
	selector: 'tuxlab-dashboard',
	templateUrl: '/client/imports/ui/pages/dashboard/dashboard.html',
	directives: [
		MATERIAL_DIRECTIVES,
		MD_ICON_DIRECTIVES,
		MD_SIDENAV_DIRECTIVES,
		ROUTER_DIRECTIVES
	],
	viewProviders: [ MdIconRegistry ],
	encapsulation: ViewEncapsulation.None
})

// Export Dashboard Class
@InjectUser('user')
export default class Dashboard extends MeteorComponent {
	user : Meteor.User;
  private courses = [];
  private grades = [];

  constructor(mdIconRegistry: MdIconRegistry) {
    super();

    // Create Icon Font
    mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
    mdIconRegistry.setDefaultFontSetClass('tuxicon');

		this.subscribe('user-courses', () => {
			this.courses = courses.find({}, { limit: 5 }).fetch();
		}, true);
    this.subscribe('course-records', () => {
      let records = course_records.find().fetch();
      for(let i = 0; i < records.length; i++) {
        let labs = (<any>records[i]).labs;
        for(let j = 0; j < labs.length; j++) {
          let tasks = labs[j].tasks;
          for(let k = 0; k < tasks.length; k++) {
            this.grades.push({
              grade: ((tasks[k].grade[0] * 100.0) / tasks[k].grade[1]).toString(),
              name: "Lab " + (j + 1).toString() + " Task " + (k + 1).toString()
            });
          }
        }
      }
    }, true);
	}

}
