// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { Tracker } from 'meteor/tracker';
	import { MeteorComponent } from 'angular2-meteor';
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/mergeMap';
	import 'rxjs/add/operator/distinct';
	import 'rxjs/add/observable/fromPromise';

// Angular Imports
	import { Component, Input, ChangeDetectorRef } from '@angular/core';
	import { Router, ActivatedRoute } from "@angular/router";

// Define Course List Component
  import template from "./course_view.component.html";
  import style from "./course_view.component.scss";

// Import Course Data
  import { CourseRecord } from '../../../both/models/course_record.model';
	import { Course } from '../../../both/models/course.model';
	import { Lab } from '../../../both/models/lab.model';

	import { CourseRecords } from '../../../both/collections/course_record.collection';
	import { Courses } from '../../../both/collections/course.collection';
	import { Labs } from '../../../both/collections/lab.collection';

// Export Data Interface

  @Component({
    selector: 'tuxlab-course-view',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class CourseView extends MeteorComponent {
		private course : Observable<Course>;
		private course_record : Observable<CourseRecord>;
		private labs : Observable<Lab[]>;

    constructor( private router : Router, private route: ActivatedRoute, private ref: ChangeDetectorRef ) {
			super();
    }

		ngOnInit(){

			this.course = this.route.params
				.map(params => params['course_id'])
				.distinct()
				.mergeMap((course_id) => {
					return Observable.fromPromise(
						new Promise((resolve, reject) => {
							Meteor.subscribe('courses.id', course_id, () => {
								var course = Courses.findOne({ _id : course_id });
								if(_.isNull(course)){
									reject("Course Not Found");
								} else {
									resolve(course);
								}
							});
						})
					)
				});

			this.course_record = this.course
				.mergeMap((course) => {
					return Observable.fromPromise(
						new Promise((resolve, reject) => {
							Meteor.subscribe('course_records.id', course._id, Meteor.userId(), () => {
								var course_record = CourseRecords.findOne({ user_id : Meteor.userId(), course_id : course._id });
								if(_.isNull(course_record)){
									reject("Course Record Not Found");
								} else {
									resolve(course_record);
								}
							});
						})
					);
				});

			this.labs = this.course
				.mergeMap((course) => {
					return Observable.fromPromise(
						new Promise((resolve, reject) => {
							Meteor.subscribe('labs.course', course._id, () => {
								var labs = Labs.find({ course_id : course._id });
								if(_.isNull(labs)){
									reject("Course Record Not Found");
								} else {
									resolve(labs.fetch());
								}
							});
						})
					);
				});

    }
  }
