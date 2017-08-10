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
	import { HostListener, Component, Input, ViewChildren, QueryList, NgZone } from '@angular/core';
	import { Router, ActivatedRoute } from "@angular/router";
	import { SortablejsOptions } from 'angular-sortablejs';

// Define Course List Component
  import template from "./course_view.component.html";
  import style from "./course_view.component.scss";

// Import Course Data
	import AccountService from '../account/account.service';
	import { User, Role } from '../../../both/models/user.model';
	import { Users } from '../../../both/collections/user.collection';

  import { CourseRecord } from '../../../both/models/course_record.model';
	import { Course } from '../../../both/models/course.model';
	import { Lab } from '../../../both/models/lab.model';

	import { CourseRecords } from '../../../both/collections/course_record.collection';
	import { Courses } from '../../../both/collections/course.collection';
	import { Labs } from '../../../both/collections/lab.collection';

	import CourseViewLabItem from './course_view_lab.component';

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

		@ViewChildren(CourseViewLabItem) lab_items : QueryList<CourseViewLabItem>;

		constructor(private accountService : AccountService,
								private zone : NgZone,
								private router : Router,
								private route: ActivatedRoute
							 ) {
			super();

			Tracker.autorun(() => {
				zone.run(() => {
					var role = Users.getRoleFor(this.route.snapshot.params['course_id'],Meteor.userId())
					this.sortableOptions.disabled = (role < Role.instructor);
				});
			});
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
								this.router.navigate(['/error','404']);
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
				Meteor.subscribe('labs.course', course._id);
				return Labs.observable.find({ course_id : course._id });
			});
    }

		/* Sortable */
		private sortable : boolean = true;
		private sortableOptions : SortablejsOptions = {
			disabled : true,
			dataIdAttr: "labId",
			store: {
				get : (sortable : any) => {
					return sortable.toArray();
				},
				set : (sortable : any) => {
					Meteor.call('Courses.reorderLabs', this.route.snapshot.params['course_id'], sortable.toArray());
				}
			}
		};

		/* File Drop */
		private dragActive = false;
		@HostListener('drop', ['$event'])
		onDrop(event) {
			 event.stopPropagation();
			 event.preventDefault();
			 this.dragActive = false;

			 // Get File
			 _.each(event.dataTransfer.files, (fileTarget) => {
				 var fileReader = new FileReader();
				 fileReader.onload = (fileEvent) => {
					 var lab_file = ((<any>fileEvent.target).result);
					 Meteor.call('Courses.createLab',{ course_id : this.route.snapshot.params['course_id'], lab_file : lab_file }, (err, res) => {
						 if(err){
							 console.error("COULD NOT UPLOAD LAB");
							 console.error(err);
						 } else {

						 }
					 })
				 }
				 fileReader.readAsText(fileTarget,"UTF-8");
			 });
		}

		@HostListener('dragover', ['$event'])
		onDragOver(event) {
			 event.stopPropagation();
			 event.preventDefault();
			 event.dataTransfer.dropEffect = 'copy';
		}

  }
