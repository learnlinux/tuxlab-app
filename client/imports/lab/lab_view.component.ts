// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { Tracker } from 'meteor/tracker';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component, Input, ChangeDetectorRef } from '@angular/core';
	import { Router, ActivatedRoute } from "@angular/router";
	import { ObservableCursor } from 'meteor-rxjs';

// Define Lab View Component
  import template from "./lab_view.component.html";
  import style from "./lab_view.component.scss";

// Import Lab Data
	import { Lab } from '../../../both/models/lab.model';
	import { Labs } from '../../../both/collections/lab.collection';

// Export Data Interface
  @Component({
    selector: 'tuxlab-lab-view',
    template,
    styles: [ style ]
  })

// Export LabView Class
  export default class LabView extends MeteorComponent {
		private lab : Lab;

    constructor( private router : Router, private route: ActivatedRoute, private ref: ChangeDetectorRef ) {
			super();
    }

		ngOnInit(){
			var self = this;

      // Get Lab Object
			self.route.params
				.map(params => params['id'])
				.subscribe((id) => {
					Tracker.autorun(() => {
						self.lab = Labs.findOne({ _id : id });
						self.ref.detectChanges();
					})
				});
    }


  }
