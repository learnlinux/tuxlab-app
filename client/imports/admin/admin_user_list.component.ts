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

	import { User, Role } from '../../../both/models/user.model';
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
						<textarea mdInput mdTextareaAutosize [(ngModel)]="session_record" [disabled]="!edit_mode"></textarea>

						<!-- Actions -->
						<br>
						<div class="actions" fxLayout="row" fxLayoutAlign="end center">

							<!-- Edit Mode -->
							<ng-container *ngIf="(course_record | async)?._id as id"[ngSwitch]="edit_mode">
								<button md-raised-button (click)="edit_mode = true" *ngSwitchCase="false">
									<md-icon>edit</md-icon>
									Edit
								</button>
								<button md-raised-button (click)="update(id)" *ngSwitchCase="true">
									<md-icon>save</md-icon>
									Save
								</button>
							</ng-container>

						</div>
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
					border: none;
					background-color: transparent;
					color: #000 !important;
					font-family: "Courier New", courier, monospace;
				}


			` ],
			changeDetection: ChangeDetectionStrategy.OnPush
		})

		export class UserSessionItem extends MeteorComponent {
			@Input('user') user : User;
			@Input('course') course : Course;
			@Input('course_record') course_record : Observable<CourseRecord>;
			@Input('session') session : Session;
			private SessionStatus = SessionStatus;

			private container_index = 0;
			private lab : Lab;

			private session_record;

			private expand : boolean = false;
			private edit_mode : boolean = false;

			constructor(private zone : NgZone, private ref: ChangeDetectorRef){
				super();
			}

			ngOnInit(){

				// Get Lab
				new Promise((resolve, reject) => {
					Meteor.subscribe('labs.course', this.session.course_id, () => {
						this.zone.run(() => {
							this.lab = Labs.findOne({ "_id" : this.session.lab_id });
							this.ref.markForCheck();
							resolve();
						})
					});
				})

				// Get Course Record for Lab
				.then(() => {
					new Promise((resolve, reject) => {
						this.course_record.subscribe((record) => {
							if(record && _.has(record, "labs."+this.lab._id+"."+this.session._id)){
								this.session_record = JSON.stringify(record.labs[this.lab._id][this.session._id],null,2);
								this.ref.markForCheck();
								resolve();
							}
						})
					})
				})

			}

			update(id){
				CourseRecords.update({
					"_id" : id
				},{
					"$set" : {
						["labs."+this.lab._id+"."+this.session._id] : JSON.parse(this.session_record)
					}
				})
				this.edit_mode = false;
			}
		}

	/** USER -> COURSE LIST **/
		@Component({
			selector: 'tuxlab-user-course-item',
			template : `
				<div class="tuxlab-user-course-item" fxLayout="column">

					<div class="expand_title" fxLayout="row" fxLayoutAlign="start center">
						<button md-icon-button (click)="expand = !expand" [ngSwitch]="expand">
							<md-icon *ngSwitchCase="true">expand_less</md-icon>
							<md-icon *ngSwitchCase="false">expand_more</md-icon>
						</button>

						<!-- Course Name -->
						<h3>{{ course?.name }}</h3>
					</div>

					<div class="expand_container" *ngIf="expand" fxLayout="column">

						<!-- Actions -->
						<div class="actions" fxLayout="row">
							<div *ngIf="role < Role.global_admin && role > Role.guest" class="mat-raised-button" fxLayout="row" fxLayoutAlign="space-evenly center">
								Role: &nbsp;
								<md-select class="role_select" [(ngModel)]="role" (ngModelChanges)="update()">
									 <md-option [value]="Role.student">Student</md-option>
									 <md-option [value]="Role.instructor">Instructor</md-option>
									 <md-option [value]="Role.course_admin">Course Admin</md-option>
								</md-select>
							</div>
						</div>

						<!-- Sessions -->
						<br>
						<ng-container [ngSwitch]="(sessions | async)?.length > 0">
							<ng-container *ngSwitchCase="false">
								<h5> No Sessions Found </h5>
							</ng-container>
							<ng-container *ngSwitchCase="true">
								<h5> Sessions: </h5>
								<br>

								<ul fxLayout="column" class="sessions">
									<li *ngFor="let session of (sessions | async);">
										<tuxlab-user-session-item [user]="user" [course]="course" [course_record]="course_record" [session]="session"></tuxlab-user-session-item>
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

					&:last-child{
						border-top: none;
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

				div.actions{
					padding: 4px;

					font-weight: 500;
					background-color: #ddd;

					mat-raised-button{
						padding: 4px;

						md-select{
							font-size: 14px !important;
						}
					}
				}

			` ],
			changeDetection: ChangeDetectionStrategy.OnPush
		})

		export class UserCourseItem extends MeteorComponent {
			@Input('user') user : User;
			@Input('course') course : Course;

			private Role = Role;
			private role : Role;

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
						this.role = Users.getRoleFor(this.course._id, this.user._id);
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
					});
				});
			}

			update(){
				Users.setRoleFor(this.course._id, this.user._id, this.role);
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

							<!-- Actions -->
							<div class="actions" fxLayout="row" style="margin-bottom:10px;">

								<!-- Delete -->
								<button md-raised-button (click)="removeUser()">
									<md-icon>delete</md-icon>
									Remove User
								</button>

								<!-- Global Admin -->
								<ng-container [ngSwitch]="user?.global_admin">
									<ng-container *ngSwitchCase="false">
										<button md-raised-button (click)="setGlobalAdministrator(true)">
											<md-icon>vpn_lock</md-icon>
											Make Global Admin
										</button>
									</ng-container>
									<ng-container *ngSwitchCase="true">
										<button md-raised-button (click)="setGlobalAdministrator(false)">
											<md-icon>vpn_lock</md-icon>
											Demote Global Admin
										</button>
									</ng-container>
								</ng-container>
							</div>

							<br>

							<!-- Course List -->
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

					&:last-child{
						border-bottom: none;
					}
				}

				div.expand_title{
				  height: 40px;
				}

				div.expand_container{
				  margin-left: 40px;
				  padding-bottom: 10px;
				}

				div.actions{
					padding: 4px;
					background-color: #ddd;
				}

				button{
					font-size: 12px;
					line-height: 30px;

					margin:0px 3px !important;

					md-icon{
						line-height: 30px;
						font-size: 18px;
					}
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

			removeUser(){
				Meteor.call('Users.remove', { user_id : this.user._id });
			}

			setGlobalAdministrator(is_global_admin){
				Meteor.call('Users.setGlobalAdministrator', {user_id : this.user._id, is_global_admin : is_global_admin});
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

			div.search_bar > div{
					padding:0px 12px;
			}

			md-input-container{
				width: 100%;
			}

			input.search_input{
				width: 100%;
				height: 40px;

				padding-left: 4px;
				margin-top: 10px;

				line-height: 40px;
				font-size: 16px;

				border: 1px solid #ddd;
			}

			ul{
				margin-top:0px !important;
			}

		` ],
		changeDetection: ChangeDetectionStrategy.OnPush
  })

  export class UserList extends MeteorComponent {
		private users : ObservableCursor<User>;
		private courses : ObservableCursor<Course>;

		private user_query : string;
		private course_query : Course;

    constructor(private zone : NgZone,
								private ref : ChangeDetectorRef,
								private route : ActivatedRoute) {
			super();
    }

		ngOnInit(){

			// Get Course Filter
			this.route.params
				.map(params => params['course_id'])
				.subscribe((course_id) => {

					if(course_id){

						// Get Course
						Meteor.subscribe('courses.id', course_id, () => {
							this.course_query = Courses.findOne({ _id : course_id });
							this.onSearch();
						})

						// Get Users for Course
						Meteor.subscribe('users.course', course_id, () => {
							this.ref.markForCheck();
						});

					} else {

						// Get All Courses
						Meteor.subscribe('courses.all');

						// Get All Users
						Meteor.subscribe('users.all', () => {
							this.ref.markForCheck();
						});

					}
				})

			this.courses = Courses.observable.find({});
			this.onSearch();
		}

		courseNameMap(course){
			return course ? course.name : course;
		}

		onSearch(){
			this.zone.run(() => {

				if(this.course_query){
					this.users = Users.observable.find({
						$and: [
							{
								"roles" : {
									"$elemMatch" : {
										"course_id" : this.course_query._id
									}
								}
							},
							{
								$or : [
									{ "_id" : this.user_query || "" },
									{ "profile.name" : { $regex : this.user_query || "", $options : 'i' } },
									{ "profile.email" : { $regex : this.user_query || "", $options : 'i' } }
								]
							}
						]
					});
				} else {
					this.users = Users.observable.find({
						$or : [
							{ "_id" : this.user_query || "" },
							{ "profile.name" : { $regex : this.user_query || "", $options : 'i' } },
							{ "profile.email" : { $regex : this.user_query || "", $options : 'i' } }
						]
					});
				}

			});
		}
  }
