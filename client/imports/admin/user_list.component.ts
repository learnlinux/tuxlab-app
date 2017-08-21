// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';
	import { ObservableCursor } from "meteor-rxjs";
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/map';
	import 'rxjs/add/operator/filter';
	import 'rxjs/add/operator/mergeMap';
	import 'rxjs/add/operator/distinct';

// Angular Imports
  import { Router, ActivatedRoute } from "@angular/router";
	import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
	import { MdDialog } from '@angular/material';

// Define Course List Component
  import template from "./user_list.component.html";
  import style from "./user_list.component.scss";

// Import Course Data
	import { Course } from '../../../both/models/course.model';
	import { Courses } from '../../../both/collections/course.collection';

	import { Lab } from '../../../both/models/lab.model';
	import { Labs } from '../../../both/collections/lab.collection';

	import { CourseRecord } from '../../../both/models/course_record.model';
	import { CourseRecords } from '../../../both/collections/course_record.collection';

	import { Session, SessionStatus } from '../../../both/models/session.model';
	import { Sessions } from '../../../both/collections/session.collection';

	import { User } from '../../../both/models/user.model';
	import { Users } from '../../../both/collections/user.collection';

// Import ConnectionDetailsDialog
	import { ConnectionDetailsDialog } from '../lab/lab_view_connection.dialog';

	/** USER -> COURSE -> SESSION **/
		@Component({
			selector: 'tuxlab-user-session-item',
			template : `
				<div class="tuxlab-user-session-item" fxLayout="row" fxLayoutAlign="flex-start center">

					<div fxLayout="row" fxLayoutAlign="flex-start center">
						<!-- Status Icon -->
						<ng-container [ngSwitch]="session.status">
							<md-chip *ngSwitchCase="SessionStatus.creating" style="background-color:#3498db;">Active</md-chip>
							<md-chip *ngSwitchCase="SessionStatus.active" style="background-color:#3498db;">Active</md-chip>
							<md-chip *ngSwitchCase="SessionStatus.completed" style="background-color:#2ecc71;">Completed</md-chip>
							<md-chip *ngSwitchCase="SessionStatus.failed" style="background-color:#e74c3c">Failed</md-chip>
							<md-chip *ngSwitchCase="SessionStatus.destroyed" style="background-color:#e67e22">Destroyed</md-chip>
						</ng-container>

						<!-- Lab Name -->
						<h5>{{ lab?.name }}</h5>
					</div>

					<div fxLayout="row" fxLayoutAlign="flex-end center">
						<!-- Connection Info -->
						<div class="connection" fxLayout="row" fxLayoutAlign="center center">
							<md-icon>dns</md-icon>
							<md-select placeholder="VMs" floatPlaceholder="never" (change)="connectionDetails($event)">
								 <md-option *ngFor="let container of session?.containers; let i = index" [value]="i">{{ (container)?.name ? container.name : "Server " + i + 1 }}</md-option>
							</md-select>
						</div>

					</div>

				</div>
			`,
			styles: [ style, `

				div.tuxlab-user-session-item div{
					width: 50%;
				}

				md-chip{
						color: #fff !important;
						padding: 2px 8px !important;
						margin-right: 5px;
				}

				div.connection{
					align-self: flex-end;
					margin-left: 3px;
					padding: 4px;

					background-color: #ddd;
				}

			` ],
			changeDetection: ChangeDetectionStrategy.OnPush
		})

		export class UserSessionItem extends MeteorComponent {
			@Input('session') session : Session;
			private SessionStatus = SessionStatus;

			private lab : Lab;

			constructor(private zone : NgZone, private dialog : MdDialog, private ref: ChangeDetectorRef){
				super();
			}

			ngOnInit(){
				Meteor.subscribe('labs.course', this.session.course_id, () => {
					this.zone.run(() => {
						this.lab = Labs.findOne({ "_id" : this.session.lab_id });
						this.ref.markForCheck();
					});
				});

			}

			private connectionDetails({value}){
				var dialogRef = this.dialog.open(ConnectionDetailsDialog, { width: '600px' });
				dialogRef.componentInstance.container = this.session.containers[value];
			}

		}

	/** USER -> COURSE LIST **/
		@Component({
			selector: 'tuxlab-user-course-item',
			template : `
				<div class="tuxlab-user-session-item" fxLayout="column">

					<div class="expand_title" fxLayout="row" fxLayoutAlign="start center">
						<button md-icon-button (click)="expand = !expand" [ngSwitch]="expand">
							<md-icon *ngSwitchCase="true">expand_less</md-icon>
							<md-icon *ngSwitchCase="false">expand_more</md-icon>
						</button>
						<h3>{{ course?.course_name }}</h3>
					</div>

					<div class="expand_container" *ngIf="expand" fxLayout="column">

						<!-- Course Record -->
						<h5> Course Record </h5>
						<textarea md-input [disabled]="!edit_mode" [ngModel]="JSON.stringify((course_record | async),null,2)" ></textarea>
						<br>

						<!-- Sessions -->
						<ng-container [ngSwitch]="(sessions | async)?.length > 0">
							<ng-container *ngSwitchCase="false">
								<h5> No Sessions Found </h5>
							</ng-container>
							<ng-container *ngSwitchCase="true">
								<h5> Sessions: </h5>

								<ul fxLayout="column" class="sessions">
									<li *ngFor="let session of (sessions | async);">
										<tuxlab-user-session-item [session]="session"></tuxlab-user-session-item>
									</li>
								</ul>
							</ng-container>
						</ng-container>
					</div>
				</div>
 			`,
			styles: [ style, `

				div.tuxlab-user-session-item{
					border-bottom: 1px solid #ccc;

					&:first-child{
						border-top: 1px solid #ccc;
					}
				}

				div.expand_title{
				  height: 20px;
				}

				div.expand_container{
				  margin-left: 40px;
					padding-top: 4px;
				  padding-bottom: 10px;
				}

				ul{
					padding: 10px !important;
				}

				textarea{
					width: 100%;
					border: none;
					background-color: transparent;
					color: #000 !important;
				}

			` ],
			changeDetection: ChangeDetectionStrategy.OnPush
		})

		export class UserCourseItem extends MeteorComponent {
			@Input('user') user : User;
			@Input('course') course : Course;

			private sessions : ObservableCursor<Session>;
			private course_record : Observable<CourseRecord>;

			private expand : boolean = false;
			private edit_mode : boolean = false;

			constructor( private router : Router,
									 private route : ActivatedRoute,
									 private zone : NgZone ) {
				super();
			}

			ngOnInit(){
				this.zone.run(() => {

					// Subscribe to Course
					new Promise((resolve, reject) => {
						Meteor.subscribe('courses.id', this.course._id, () => {
							resolve();
						})
					})

					// Get Course
					.then(() => {
						this.course = Courses.findOne({ _id : this.course._id });
					})

					// Get Sub-Items
					.then(() => {
						return Promise.all([

							// Get Course Records
							new Promise((resolve, reject) => {
								Meteor.subscribe('course_records.id', this.course._id, this.user._id, () => {
									resolve();
								});
							}).then(() => {
								this.course_record = CourseRecords.observable.find({
									user_id: this.user._id,
									course_id : this.course._id
								}).filter((courses) => {
									return courses && _.has(courses, "length") && courses.length > 0;
								}).map((courses) => {
									return _.head(courses);
								})
							}),

							// Get Sessions
							new Promise((resolve, reject) => {
								Meteor.subscribe('Sessions.userCourse', this.user._id, this.course._id, () => {
									resolve();
								});
							}).then(() => {
								this.sessions = Sessions.observable.find({
									user_id: this.user._id,
									course_id : this.course._id
								});
							})
						])
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

						<div class="expand_container courses" *ngIf="expand" fxLayout="column">
							<br>
							<ng-container [ngSwitch]="(courses | async)?.length > 0">
								<ng-container *ngSwitchCase="false">
									<h5> No Courses Found </h5>
								</ng-container>
								<ng-container *ngSwitchCase="true">
									<h5> Courses: </h5>

									<ul fxLayout="column" class="courses">
										<li *ngFor="let course of courses | async">
											<tuxlab-user-course-item [course]="course" [user]="user"></tuxlab-user-course-item>
										</li>
									</ul>
								</ng-container>
							</ng-container>
						</div>

					</div>
			`,
			styles: [ style, `

				div.tuxlab_user_item{
				  padding:5px 0px;
				  border-bottom: 1px solid #ccc;
				}

				div.expand_title{
				  height: 40px;
				}

				div.expand_container{
				  margin-left: 40px;
				  padding-bottom: 10px;
				}

			` ],
			changeDetection: ChangeDetectionStrategy.OnPush
		})

		export class UserItem extends MeteorComponent {
			@Input('user') user : User;
			private courses : ObservableCursor<Course>;

			private expand : boolean = false;

			constructor( private zone : NgZone ) {
				super();
			}

			ngOnInit(){
				this.courses = Users.getCoursesFor(this.user._id);
			}
		}

/** USER LIST **/
  @Component({
    selector: 'tuxlab-user-list',
    template,
    styles: [ style, `

			div.user_list{
			  width: 100%;
			  max-width: 960px;
			  min-height: 900px;

			  margin: 30px auto;
			  padding: 45px;

			  background-color: #fff;
			  box-shadow:
			   0 -1px 1px rgba(0,0,0,0.15),
			   0 -10px 0 -5px #eee,
			   0 -10px 1px -4px rgba(0,0,0,0.15),
			   0 -20px 0 -10px #eee,
			   0 -20px 1px -9px rgba(0,0,0,0.15);
			}

		` ],
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
			Meteor.subscribe('users.all');
			Meteor.subscribe('courses.all');
			this.users = Users.observable.find({});
		}
  }
