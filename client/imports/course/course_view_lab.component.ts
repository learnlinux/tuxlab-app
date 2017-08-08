// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
  import { Router } from "@angular/router";
	import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

// Define Course List Component
  import template from "./course_view_lab.component.html";
  import style from "./course_view_lab.component.scss";

// Collections and Models
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
    @Input('lab') lab : Lab;
		private lab_backup : Lab;

    public edit_mode : boolean = false;

    constructor() {
			super();
    }

		ngOnInit(){
			this.lab_backup = _.cloneDeep(this.lab);
		}

		// Lab Statuses
		private status_options = [
			{
				name : 'Hidden',
				value : LabStatus.hidden,
				icon : 'lock'
			},
			{
				name : 'Open',
				value : LabStatus.open,
				icon : 'lock_open'
			},
			{
				name : 'Closed',
				value : LabStatus.closed,
				icon : 'lock_outline'
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
					description : this.lab.description
				}
      }, (err, res) => {
				if(err){
					console.error(err);
				}
      });
    }

		private delete(){
			Labs.remove(this.lab._id, (err, res) => {
				if(err){
					console.error(err);
				}
			});
		}

  }
