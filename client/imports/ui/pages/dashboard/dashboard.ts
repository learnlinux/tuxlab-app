// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';
	import { InjectUser } from 'angular2-meteor-accounts-ui';
	import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';

// Collections
  import { courses } from '../../../../../collections/courses.ts';
  import { course_records } from '../../../../../collections/course_records.ts';

// Explore
  import { ExploreView } from '../../components/explore/explore.ts';

// Login
  import Login from '../account/login.ts';

// Define Dashboard Component
@Component({
  selector: 'tuxlab-dashboard',
  templateUrl: '/client/imports/ui/pages/dashboard/dashboard.html',
  directives: [
    MATERIAL_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES,
    ROUTER_DIRECTIVES,
    Login,
    ExploreView
  ]
})

// Export Dashboard Class
@InjectUser('user')
export default class Dashboard extends MeteorComponent {
  user : Meteor.User;
  private courses = [];
  private grades = [];

  constructor() {
    super();

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
