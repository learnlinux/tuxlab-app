// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
  import { Router, ActivatedRoute } from "@angular/router";
	import { Component, Input, ChangeDetectionStrategy, NgZone } from '@angular/core';

// Define Course List Component
  import template from "./course_view_lab.component.html";
  import style from "./course_view_lab.component.scss";

// Collections and Models
	import AccountService from '../account/account.service';
	import { User, Role } from '../../../both/models/user.model';
	import { Users } from '../../../both/collections/user.collection';

  import { Lab, LabStatus } from '../../../both/models/lab.model';
  import { Labs } from '../../../both/collections/lab.collection';

// Export Data Interface
  @Component({
    selector: 'tuxlab-course-view-lab',
    template,
    styles: [ style ],
		changeDetection: ChangeDetectionStrategy.OnPush
  })

// Export Dashboard Class
  export default class CourseViewLabItem extends MeteorComponent {
		private user : User;
		private role : Role;
		private Role = Role;

    @Input('lab') lab : Lab;
		private lab_backup : Lab;

    public edit_mode : boolean = false;

    constructor(private accountService : AccountService,
								private zone : NgZone,
								private route: ActivatedRoute) {
			super();
    }

		ngOnInit(){
			this.lab_backup = _.cloneDeep(this.lab);

			// Get Role
			this.route.params
				.map(params => params['course_id'])
				.distinct()
				.subscribe((course_id) => {
					Tracker.autorun(() => {
						this.zone.run(() => {
							this.role = Users.getRoleFor(course_id, Meteor.userId());
							this.user = <User>Meteor.user();
						});
					});
				})
		}

		// Lab Statuses
		private status_options = [
			{
				name : 'Hidden',
				value : LabStatus.hidden,
				icon : 'lock_outline'
			},
			{
				name : 'Open',
				value : LabStatus.open,
				icon : 'lock_open'
			},
			{
				name : 'Closed',
				value : LabStatus.closed,
				icon : 'lock'
			}
		];

		private getIcon(status_value){
			return _.find(this.status_options, (opt) => {
				return opt.value === status_value;
			}).icon;
		}

		private cancel(){
			this.edit_mode = false;
			this.lab = this.lab_backup;
		}

    private update(){
      Labs.update(this.lab._id, {
				$set : {
					name : this.lab.name,
					description : this.lab.description,
					status: this.lab.status
				}
      }, (err, res) => {
				if(err){
					console.error(err);
				}
      });
    }

		private delete(){
			Meteor.call('Courses.removeLab', { course_id : this.lab.course_id, lab_id: this.lab._id }, (err, res) => {
				if(err){
					console.error(err);
				}
			})
		}

  }
