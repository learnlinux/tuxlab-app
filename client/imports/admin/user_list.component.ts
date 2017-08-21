// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';
	import { ObservableCursor } from "meteor-rxjs";
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/mergeMap';
	import 'rxjs/add/operator/distinct';

// Angular Imports
  import { Router, ActivatedRoute } from "@angular/router";
	import { Component, Input, ChangeDetectionStrategy, NgZone } from '@angular/core';

// Define Course List Component
  import template from "./user_list.component.html";
  import style from "./user_list.component.scss";

// Import Course Data
	import { Course } from '../../../both/models/course.model';
	import { Courses } from '../../../both/collections/course.collection';

	import { CourseRecord } from '../../../both/models/course_record.model';
	import { CourseRecords } from '../../../both/collections/course_record.collection';

	import { Session } from '../../../both/models/session.model';
	import { Sessions } from '../../../both/collections/session.collection';

	import { User } from '../../../both/models/user.model';
	import { Users } from '../../../both/collections/user.collection';

	/** USER -> COURSE -> SESSION **/
		@Component({
			selector: 'tuxlab-user-session-item',
			template : `
				A Session
			`,
			styles: [ style ],
			changeDetection: ChangeDetectionStrategy.OnPush
		})

		export class UserSessionItem extends MeteorComponent {
			@Input('session') session : Session;

		}

	/** USER -> COURSE LIST **/
		@Component({
			selector: 'tuxlab-user-courserecord-item',
			template : `
				<div fxLayout="column">

					<div class="expand_title" fxLayout="row" fxLayoutAlign="start center">
						<button md-icon-button (click)="expand = !expand" [ngSwitch]="expand">
							<md-icon *ngSwitchCase="true">expand_less</md-icon>
							<md-icon *ngSwitchCase="false">expand_more</md-icon>
						</button>
						<h5>{{ course?.course_name }}</h5>
					</div>

					<div class="expand_container" *ngIf="expand" fxLayout="column" class="course_records">
						<h5> Sessions: </h5>

						<ul fxLayout="column" class="sessions">
							<li *ngFor="let session of (sessions | async);">
								<tuxlab-user-session-item [session]="session"></tuxlab-user-session-item>
							</li>
						</ul>
					</div>
				</div>
			`,
			styles: [ `` ],
			changeDetection: ChangeDetectionStrategy.OnPush
		})

		export class UserCourseRecordItem extends MeteorComponent {
			@Input('user') user : User;
			@Input('courserecord') course_record : CourseRecord;

			private course : Course;
			private sessions : ObservableCursor<Session>;

			private expand : boolean = false;

			constructor( private router : Router,
									 private route : ActivatedRoute,
									 private zone : NgZone ) {
				super();
			}

			ngOnInit(){
				this.zone.run(() => {

					// Subscribe to Course
					new Promise((resolve, reject) => {
						Meteor.subscribe('courses.id', this.course_record.course_id, () => {
							resolve();
						})
					})

					// Get Course
					.then(() => {
						this.course = Courses.findOne({ _id : this.course_record.course_id });
					})

					// Subscribe to Sessions
					.then(() => {
						return new Promise((resolve, reject) => {
							Meteor.subscribe('Sessions.userCourse', this.user._id, this.course_record.course_id, () => {
								resolve();
							});
						})
					})

					// Get Sessions
					.then(() => {
						this.sessions = Sessions.observable.find({
							user_id: this.user._id,
							course_id : this.course._id
						});
					})
				})
			}
		}

	/** USER ITEM **/
		@Component({
			selector: 'tuxlab-user-item',
			template : `
					<div class="tuxlab_user_item" fxLayout="column">

						<div class="expand_title" fxLayout="row" fxLayoutAlign="start center">
							<button md-icon-button (click)="expand = !expand" [ngSwitch]="expand">
								<md-icon *ngSwitchCase="true">expand_less</md-icon>
								<md-icon *ngSwitchCase="false">expand_more</md-icon>
							</button>
							<div>
								<h3>{{ user?.profile?.name }}</h3>
								<h4>{{ user?.profile?.email }}</h4>
							</div>
						</div>

						<div class="expand_container course_records" *ngIf="expand" fxLayout="column">
							<br>
							<ng-container [ngSwitch]="(course_records | async)?.length > 0">
								<ng-container *ngSwitchCase="false">
									<h5> No Courses Found </h5>
								</ng-container>
								<ng-container *ngSwitchCase="true">
									<h5> Courses: </h5>

									<ul fxLayout="column" class="course_records">
										<li *ngFor="let record of (course_records | async);">
											<tuxlab-user-courserecord-item [courserecord]="record" [user]="user"></tuxlab-user-courserecord-item>
										</li>
									</ul>
								</ng-container>
							</ng-container>
						</div>

					</div>
			`,
			styles: [ style ],
			changeDetection: ChangeDetectionStrategy.OnPush
		})

		export class UserItem extends MeteorComponent {
			@Input('user') user : User;
			private course_records : ObservableCursor<CourseRecord>;

			private expand : boolean = false;

			constructor( private zone : NgZone ) {
				super();
			}

			ngOnInit(){
				Meteor.subscribe('course_records.user', this.user._id);
				this.course_records = CourseRecords.observable.find({
					user_id : this.user._id
				});
			}
		}

/** USER LIST **/
  @Component({
    selector: 'tuxlab-user-list',
    template,
    styles: [ style ],
		changeDetection: ChangeDetectionStrategy.OnPush
  })

  export class UserList extends MeteorComponent {
		private users : ObservableCursor<User>;

    constructor( private router : Router,
								 private route : ActivatedRoute,
							   private zone : NgZone ) {
			super();
    }

		ngOnInit(){
			Meteor.subscribe('user.all');
			this.users = Users.observable.find({});
		}
  }
