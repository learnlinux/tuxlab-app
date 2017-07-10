// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component, Input } from '@angular/core';

// Define Course List Component
  import template from "./course_list.component.html";
  import style from "./course_list.component.scss";

// Import Course Data
	import { Course } from '../../../both/models/course.model';
	import { Users } from '../../../both/collections/user.collection';

  @Component({
    selector: 'tuxlab-course-list',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class CourseList extends MeteorComponent {
		@Input('courses') courses: Course[];

    constructor() {
      super();

			if(_.isUndefined(this.courses) && Meteor.userId() !== null){
				this.courses = Users.getCoursesFor(Meteor.userId());
			} else if (_.isArray(this.courses) && this.courses.length !== 0){
				this.courses = this.courses;
			} else {
				this.courses = [];
			}
    }
  }
