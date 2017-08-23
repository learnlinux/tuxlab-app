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
	import { Component, Input, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';

// Define Course List Component
  import template from "./course_list.component.html";
  import style from "./course_list.component.scss";

// Import Course Data
	import { Course, ContentPermissions, EnrollPermissions } from '../../../both/models/course.model';
	import { Courses } from '../../../both/collections/course.collection';

	import { User, Role } from '../../../both/models/user.model';
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
		@Input('type') type : string;

		private title : string;
		private courses : ObservableCursor<Course>;
		private user : User;

		private cols : number = 2;
		private admin_edit_mode : boolean = false;
		private user_edit_mode : boolean = false;
		private is_global_admin : boolean;

    constructor(private router : Router, private zone : NgZone, private ref : ChangeDetectorRef ) {
			super();
    }

		ngOnInit(){

			// Get User Roles
			Tracker.autorun(() => {
				this.zone.run(() => {
					this.user = <User>Meteor.user();
					if(this.user){
						this.is_global_admin = Users.isGlobalAdministrator(this.user._id);
					}
					this.ref.markForCheck();
				});
			});

			// My Courses Page
			if(this.router.url === "/courses"){
				if(Meteor.userId() === null){
					this.router.navigate(['/login']);

				} else {
					this.user_edit_mode = true;

					this.title = "My Courses";
					this.courses = Users.getCoursesFor(Meteor.userId());
					Meteor.subscribe('courses.user');
				}

			// Explore Courses Page
			} else if (this.router.url === "/explore"){
				this.title = "Explore";
				this.courses = Courses.observable.find();
				Meteor.subscribe('courses.explore', 0);

			} else if (this.router.url === "/admin"){
				this.admin_edit_mode = true;

				this.title = null;
				this.courses = Courses.observable.find({});
				Meteor.subscribe('courses.all');

			} else if (this.type === "my_courses") {

				this.cols = 1;
				this.title = null;

				if(Meteor.userId()){
					this.courses = Users.getCoursesFor(Meteor.userId());
				}

				Meteor.subscribe('courses.user');

			} else if (this.type === "featured_courses") {
				this.title = null;
				this.courses = Courses.observable.find({
					featured: true
				});
				Meteor.subscribe('courses.featured');

			} else {
				this.router.navigate(['error','404']);
			}
		}

		createCourse(){
			// Insert Courses
			new Promise((resolve, reject) => {
				Courses.insert({
					name : "New Course",
					course_number : "101",
					featured: false,
					instructors: [],
					labs: [],
					permissions: {
						meta: false,
						content: ContentPermissions.None,
						enroll: EnrollPermissions.None
					}
				}, (err, res) => {
					if(err){
						reject(err);
					} else {
						resolve(res);
					}
				});
			})

			// Navigate to new Course
			.then((id) => {
				this.router.navigate(['courses', id]);
			})
		}

		featureCourse(course_id , featured){
			Meteor.call('Courses.setFeatured',{
				course_id : course_id,
				featured : featured
			})
		}

		deleteCourse(course_id){
			Meteor.call('Courses.remove', {
				course_id : course_id
			})
		}

		removeUserFromCourse(course_id){
			Meteor.call('Users.removeFromCourse', {
				user_id : Meteor.userId(),
				course_id : course_id
			})
		}

  }
