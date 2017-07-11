// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { Tracker } from 'meteor/tracker';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component, Input, ChangeDetectorRef } from '@angular/core';
	import { Router, ActivatedRoute } from "@angular/router";

// Define Course List Component
  import template from "./course_view.component.html";
  import style from "./course_view.component.scss";

// Import Course Data
	import { Course } from '../../../both/models/course.model';
	import { Courses } from '../../../both/collections/course.collection';
	import { Users } from '../../../both/collections/user.collection';

// Export Data Interface

  @Component({
    selector: 'tuxlab-course-view',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class CourseView extends MeteorComponent {
		private course : Course;

    constructor( private router : Router, private route: ActivatedRoute, private ref:ChangeDetectorRef ) {
			super();

    }

		ngOnInit(){
			var self = this;

			self.route.params
				.map(params => params['id'])
				.subscribe((id) => {
					Tracker.autorun(() => {
						self.course = Courses.findOne({ _id : id });
						self.ref.detectChanges();
					})
				});
    }

  }
