// Meteor Imports
	import * as _ from "lodash";
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/map';
	import 'rxjs/add/operator/distinct';
	import 'rxjs/add/operator/mergeMap';
	import 'rxjs/add/observable/bindNodeCallback';

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
	import prism_style from "prismjs/themes/prism.css";

// Import Lab Data
	import { Lab } from '../../../both/models/lab.model';
	import { Labs } from '../../../both/collections/lab.collection';
	import { Session } from '../../../both/models/session.model';
	import { Sessions } from '../../../both/collections/session.collection';

// Export Data Interface
  @Component({
    selector: 'tuxlab-lab-view',
    template,
    styles: [ style ]
  })

// Export LabView Class
  export default class LabView extends MeteorComponent {
		private lab : Observable<Lab>;
		private session : Observable<Session>;

		private task_index : number;

    constructor( private router : Router, private route: ActivatedRoute, private ref: ChangeDetectorRef ) {
			super();
			prism_style;
    }

		ngOnInit(){

			// Lab
			this.lab = this.route.params
				.map(params => params['lab_id'])
				.distinct()
				.map((id) => {
					var lab = Labs.findOne({ _id : id });
					if(_.isNull(lab)){
						throw "Lab Not Found";
					} else {
						return lab;
					}
				});

			// Session
			this.session = this.lab.mergeMap((lab) => {
				if(lab && lab._id){
					return Observable.bindNodeCallback<Session>(Meteor.call)('session.getOrCreate',lab._id);
				}
			});

			// Set Task Index
			this.session.subscribe((session) => {
				this.task_index = session.current_task;
			});
    }

		check(){

		}

  }
