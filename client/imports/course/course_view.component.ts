// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';
	import { Router, ActivatedRoute } from "@angular/router";

// Angular Imports
	import { Component, Input } from '@angular/core';

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

    constructor(private router : Router, private route: ActivatedRoute) {
			super();
    }

    ngOnInit(){
			this.route.params
				.map(params => params['id'])
				.subscribe((id) => {
					this.course = Courses.findOne({ id : id});
				});
    }
  }
