// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { Tracker } from 'meteor/tracker';
	import { MeteorComponent } from 'angular2-meteor';
	import { BehaviorSubject } from 'rxjs/BehaviorSubject';
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/mergeMap';
	import 'rxjs/add/operator/distinct';

// Angular Imports
	import { HostListener, Component, Input, ViewChildren, QueryList, NgZone } from '@angular/core';
	import { Router, ActivatedRoute } from "@angular/router";
	import { MdDialog } from '@angular/material';
	import { SortablejsOptions } from 'angular-sortablejs';

// Define Course List Component
  import template from "./course_view.component.html";
  import style from "./course_view.component.scss";

	import AccountService from '../account/account.service';
	import { User, Role } from '../../../both/models/user.model';
	import { Users } from '../../../both/collections/user.collection';

  import { CourseRecord } from '../../../both/models/course_record.model';
	import { Course, Permissions, ContentPermissions, EnrollPermissions } from '../../../both/models/course.model';
	import { Lab } from '../../../both/models/lab.model';

	import { CourseRecords } from '../../../both/collections/course_record.collection';
	import { Courses } from '../../../both/collections/course.collection';
	import { Labs } from '../../../both/collections/lab.collection';

// SubComponents
	import CourseViewLabItem from './course_view_lab.component';
	import SelectUser from '../dialogs/select_user.dialog';

  @Component({
    selector: 'tuxlab-course-view',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class CourseView extends MeteorComponent {
		private user : User;
		private role : Role;
		private Role = Role;

		private course : Observable<Course>;
		private course_model : Course;
		private course_behaviorSubject : BehaviorSubject<Course>;

		private instructors : Observable<{ id : string; name : string; role : Role;}[]>;
		private course_record : Observable<CourseRecord>;
		private labs : Observable<Lab[]>;

		@ViewChildren(CourseViewLabItem) lab_items : QueryList<CourseViewLabItem>;

		constructor(private accountService : AccountService,
								private zone : NgZone,
								private router : Router,
								private route: ActivatedRoute,
								private dialog : MdDialog
							 ) {
			super();
		}

		ngOnInit(){

			// Get Role
			this.route.params
				.map(params => params['course_id'])
				.distinct()
				.subscribe((course_id) => {
					Tracker.autorun(() => {
						this.zone.run(() => {
							this.user = <User>Meteor.user();
							this.role = Users.getRoleFor(course_id, Meteor.userId())
						});
					});
				})

			// Get Course
			this.course = this.route.params
				.map(params => params['course_id'])
				.distinct()
				.mergeMap((course_id) => {
					Meteor.subscribe('courses.id', course_id);
					var course = Courses.findOne({ _id : course_id });
					if(course){
						this.course_behaviorSubject = new BehaviorSubject(course);
						return(this.course_behaviorSubject);
					} else {
						this.router.navigate(['/error','404']);
					}
				});

			this.course.subscribe((course) => {
				this.course_model = course;
			})

			// Get Instructors
			this.instructors = this.course
				.distinct()
				.mergeMap((course) => {
					Meteor.subscribe('user.instructors', course._id);
					return Users.observable
					.find({ _id : { $in : course.instructors }})
					.map(users => {

						// Filter for Roles
						users = _.filter(users, (user) => {
							var priv = _.find(user.roles, (priv) => {
								return priv.course_id === course._id
							});

							return priv && _.has(priv, "role") && priv.role >= Role.instructor;
						});

						// Map Roles
						var instructors = _.map(users, (user) => {
							return {
								id : user._id,
								name : user.profile.name,
								role : _.find(user.roles, (priv) => {
									return priv.course_id === course._id
								}).role
							}
						});

						// Sort by Roles
						instructors = _.sortBy(instructors, (user) => {
							return ((-1) * user.role);
						});

						return instructors;
					})
				})

			// Get Course Record
			this.course_record = this.course
				.distinct()
				.mergeMap((course) => {
						Meteor.subscribe('course_records.id', course._id, Meteor.userId());
						var course_record = CourseRecords.findOne({ user_id : Meteor.userId(), course_id : course._id });
						if(course_record){
							return new BehaviorSubject(course_record);
						} else {
							return new BehaviorSubject(null);
						}
				});

			// Get Labs
			this.labs = this.course
				.distinct()
				.mergeMap((course) => {
					Meteor.subscribe('labs.course', course._id);
					return Labs.observable.find({ course_id : course._id })
						.map((arr) => {
							return _.sortBy(arr, (lab) => {
								return _.findIndex(course.labs, (lab_id) => {
									return lab_id === lab._id;
								})
							})
						});
				});
    }

		/* Course Editable */
		private edit_mode : boolean = false;

		private update(){
			Courses.update({
				_id : this.route.snapshot.params['course_id']
			},{
				$set : {
					"course_description.content" : this.course_model.course_description.content,
					"course_description.syllabus" : this.course_model.course_description.syllabus,
					"permissions.content" : this.course_model.permissions.content,
					"permissions.enroll" : this.course_model.permissions.enroll
				}
			}, () => {
				this.course_behaviorSubject.next(Courses.findOne({ _id : this.route.snapshot.params['course_id'] }));
			});
			this.edit_mode = false;
		}

		private cancel(){
			this.edit_mode = false;
		}

		private addInstructor(){
			var dialogRef = this.dialog.open(SelectUser, { width: '600px' });
			dialogRef.afterClosed().subscribe((user) => {
				if(!_.isNull(user)){
					this.addRole(user._id, Role.instructor);
				}
			})
		}

		private addCourseAdmin(){
			var dialogRef = this.dialog.open(SelectUser, { width: '600px' });
			dialogRef.afterClosed().subscribe((user) => {
				if(!_.isNull(user)){
					this.addRole(user._id, Role.course_admin);
				}
			})
		}

		private addRole(user_id : string, role : Role){
			Meteor.call('Users.addRoleForCourse',{
				user_id : user_id,
				course_id : this.route.snapshot.params['course_id'],
				role : role
			},(err, res) => {
				if(err){
					console.error(err);
				}
			})
		}

		private removeRole(user_id : string, role : string){
			Meteor.call('Users.removeRoleForCourse',{
				user_id : user_id,
				course_id : this.route.snapshot.params['course_id'],
				role : role
			},(err, res) => {
				if(err){
					console.error(err);
				}
			})
		}

		private content_options = [
			{
				name : 'Anyone',
				value : ContentPermissions.Any,
				icon : 'public'
			},
			{
				name : 'Authenticated Users',
				value : ContentPermissions.Auth,
				icon : 'verified_user'
			},
			{
				name : 'No One',
				value : ContentPermissions.None,
				icon : 'block'
			}
		];

		private enroll_options = [
			{
				name : 'Logged In Users',
				value : EnrollPermissions.Any,
				icon : 'verified_user'
			},
			{
				name : 'No One',
				value : EnrollPermissions.None,
				icon : 'block'
			}
		];

		private getIcon_content(content_value){
			return _.find(this.content_options, (opt) => {
				return opt.value === content_value;
			}).icon;
		}

		private getIcon_enroll(enroll_value){
			return _.find(this.enroll_options, (opt) => {
				return opt.value === enroll_value;
			}).icon;
		}

		/* Sortable */
		private sortableOptions : SortablejsOptions = {
			dataIdAttr: "labId",
			store: {
				get : (sortable : any) => {
					return sortable.toArray();
				},
				set : (sortable : any) => {
					Meteor.call('Courses.reorderLabs', { course_id : this.route.snapshot.params['course_id'], labs : sortable.toArray() });
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
