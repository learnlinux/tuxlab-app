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
  import template from "./admin_user_list.component.html";
  import style from "./admin_user_list.component.scss";

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
				<div class="tuxlab-user-session-item" fxLayout="column">

					<div class="expand_title" fxLayout="row" fxLayoutAlign="start center">
							<!-- Expand Button -->
							<button md-icon-button (click)="expand = !expand" [ngSwitch]="expand">
								<md-icon *ngSwitchCase="true">expand_less</md-icon>
								<md-icon *ngSwitchCase="false">expand_more</md-icon>
							</button>

							<!-- Status Icon -->
							<ng-container [ngSwitch]="session.status">
								<md-chip *ngSwitchCase="SessionStatus.creating" style="background-color:#3498db;">Active</md-chip>
								<md-chip *ngSwitchCase="SessionStatus.active" style="background-color:#3498db;">Active</md-chip>
								<md-chip *ngSwitchCase="SessionStatus.completed" style="background-color:#2ecc71;">Completed</md-chip>
								<md-chip *ngSwitchCase="SessionStatus.failed" style="background-color:#e74c3c">Failed</md-chip>
								<md-chip *ngSwitchCase="SessionStatus.destroyed" style="background-color:#e67e22">Destroyed</md-chip>
							</ng-container>

							<!-- Lab Name -->
							<h3>{{ lab?.name }}</h3>
					</div>

					<div class="expand_container" *ngIf="expand" fxLayout="column">
						<br>

						<!-- Connection Details -->
						<h5> VMs: </h5>
						<br>
						<div fxLayout="row">
							<md-icon>dns</md-icon>
							<md-select [ngModel]="container_index">
								 <md-option *ngFor="let container of session?.containers; let i = index" [value]="i">{{ (container)?.name ? container.name : "Server " + i + 1 }}</md-option>
							</md-select>
						</div>

						<br>

						<div class="connection" *ngIf="session?.containers[container_index] as container">
							<table>
								<tr>
									<td> Host: </td>
									<td>{{ container?.container_ip }}</td>
								</tr>
								<tr>
									<td> Username: </td>
									<td>{{ container?.proxy_username }}</td>
								</tr>
								<tr>
									<td> Password: </td>
									<td> {{ container?.container_pass }} </td>
								</tr>
							</table>
						</div>

						<br>

						<!-- Session Record -->
						<h5> Session Record: </h5>
						<br>
						<textarea [ngModel]="getCourseRecordJSON((course_record | async))" [disabled]="!edit_mode"></textarea>
					</div>

				</div>
			`,
			styles: [ style, `

				div.expand_title{
					height: 20px;
				}

				div.expand_container{
					margin-left: 40px;
					padding-top: 4px;
					padding-bottom: 10px;
				}

				md-chip{
						color: #fff !important;
						padding: 2px 8px !important;
						margin-right: 5px;
				}

				div.connection{
				  padding: 20px;

				  background-color: #333;
				  color:#efefef;

				  table{
				    margin:0 auto;

				    tr{
				      td{
				        padding: 5px;

				        &:first-child{
				          font-weight: bold;
				        }
				      }
				    }
				  }
				}

				textarea{
					width: 100%;
					min-height: 300px;
					border: none;
					background-color: transparent;
					color: #000 !important;
				}

			` ],
			changeDetection: ChangeDetectionStrategy.OnPush
		})

		export class UserSessionItem extends MeteorComponent {
			@Input('course_record') course_record : Observable<CourseRecord>;

			@Input('session') session : Session;
			private SessionStatus = SessionStatus;
			private container_index = 0;

			private lab : Lab;

			private expand : boolean = false;
			private edit_mode : boolean = false;

			constructor(private zone : NgZone, private ref: ChangeDetectorRef){
				super();
			}

			ngOnInit(){
				// Get Lab
				Meteor.subscribe('labs.course', this.session.course_id, () => {
					this.zone.run(() => {
						this.lab = Labs.findOne({ "_id" : this.session.lab_id });
						this.ref.markForCheck();
					});
				});
			}

			private getCourseRecordJSON(record){
				if(record && _.has(record, "labs."+this.lab._id+"."+this.session._id)){
					return JSON.stringify(record.labs[this.lab._id][this.session._id],null,2);
				}
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

						<!-- Sessions -->
						<ng-container [ngSwitch]="(sessions | async)?.length > 0">
							<ng-container *ngSwitchCase="false">
								<h5> No Sessions Found </h5>
							</ng-container>
							<ng-container *ngSwitchCase="true">
								<h5> Sessions: </h5>
								<br>

								<ul fxLayout="column" class="sessions">
									<li *ngFor="let session of (sessions | async);">
										<tuxlab-user-session-item [session]="session" [course_record]="course_record"></tuxlab-user-session-item>
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

			` ],
			changeDetection: ChangeDetectionStrategy.OnPush
		})

		export class UserCourseItem extends MeteorComponent {
			@Input('user') user : User;
			@Input('course') course : Course;

			private sessions : ObservableCursor<Session>;
			private course_record : Observable<CourseRecord>;

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

			  margin: 5px;
			}

			input#searchInput{
			  width: 100%;
			  height: 40px;

			  padding-left: 4px;
			  margin-top: 10px;

			  line-height: 40px;
			  font-size: 16px;
			}


		` ],
		changeDetection: ChangeDetectionStrategy.OnPush
  })

  export class UserList extends MeteorComponent {
		private users : ObservableCursor<User>;

		private query : string = "";

    constructor( private zone : NgZone ) {
			super();
    }

		ngOnInit(){
			Meteor.subscribe('users.all');
			Meteor.subscribe('courses.all');
			this.onSearch();
		}

		onSearch(){
			this.zone.run(() => {
				this.users = Users.observable.find({
					$or : [
						{ "_id" : this.query },
						{ "profile.name" : { $regex : this.query, $options : 'i' } },
						{ "profile.email" : { $regex : this.query, $options : 'i' } }
					]
				});
			});
		}
  }
