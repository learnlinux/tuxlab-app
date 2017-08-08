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
    public edit_mode : boolean = false;

    // Lab Statuses
    private status_options = _.map(_.filter(Object.keys(LabStatus), (k) => {
      return isNaN(parseInt(k));
    }), (k) => {
      return { name : k, value : LabStatus[k] };
    });

    constructor() {
			super();
    }

		ngOnInit(){

		}

    private update(){
      Labs.update(this.lab._id, {

      }, (err, res) => {


        this.edit_mode = false;
      });
    }

  }
