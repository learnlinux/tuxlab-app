// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';
	import { ObservableCursor } from "meteor-rxjs";
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/mergeMap';
	import 'rxjs/add/operator/distinct';

// Angular Imports
  import { Router } from "@angular/router";
	import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

// Define Course List Component
  import template from "./course_list.component.html";
  import style from "./course_list.component.scss";

// Import Course Data
	import { Course } from '../../../both/models/course.model';
	import { Courses } from '../../../both/collections/course.collection';
	import { Users } from '../../../both/collections/user.collection';

// Export Data Interface
  @Component({
    selector: 'tuxlab-course-list',
    template,
    styles: [ style ],
		changeDetection: ChangeDetectionStrategy.OnPush
  })

// Export Dashboard Class
  export default class CourseList extends MeteorComponent {
		private title : string;
		private courses : ObservableCursor<Course>;

    constructor(private router : Router) {
			super();
    }

		ngOnInit(){

			// My Courses Page
			if(this.router.url === "/courses"){
				if(Meteor.userId() === null){
					this.router.navigate(['/login']);

				} else {
					this.title = "My Courses";
					this.courses = Users.getCoursesFor(Meteor.userId());
					Meteor.subscribe('courses.user');
				}

			// Explore Courses Page
			} else if (this.router.url === "/explore"){
				this.title = "Explore";
				this.courses = Courses.observable.find();
				Meteor.subscribe('courses.explore', 0);
			} else {
				this.router.navigate(['error','404']);
			}
		}
  }
