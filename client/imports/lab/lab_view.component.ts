// Meteor Imports
	import * as _ from "lodash";
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/map';
	import 'rxjs/add/operator/distinct';
	import 'rxjs/add/operator/mergeMap';
	import 'rxjs/add/observable/bindNodeCallback';
	import 'rxjs/add/observable/bindCallback';

	import { Meteor } from 'meteor/meteor';
	import { Tracker } from 'meteor/tracker';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component, Input } from '@angular/core';
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
		private session : Observable<{} | Session>;

		private task_index : number;

    constructor( private router : Router, private route: ActivatedRoute) {
			super();
			prism_style;
    }

		ngOnInit(){

				// Lab
				this.lab = this.route.params
					.map(params => params['lab_id'])
					.distinct()
					.mergeMap((id) => {
						return Observable.bindCallback<Lab>((cb) => {
							Meteor.subscribe('labs', { _id: id }, {
								onReady: () => {
									var lab = Labs.findOne({ _id : id });
									if(_.isNull(lab)){
										console.error("Lab Not Found");
									} else {
										cb(lab);
									}
								}
							});
						})();
					});

				// Session
				this.session = this.lab
				.filter((x) => { return _.has(x, "_id")})
				.distinct(x => x._id)
				.mergeMap((lab) => {
					if(lab && lab._id){
						return Observable.bindNodeCallback<Session>(Meteor.call)('session.getOrCreate',lab._id)
										.catch((e) => {
											console.error(e);
											return Observable.empty();
										});
					}
				});

				// Set Task Index
				this.session.subscribe((session) => {
					if("current_task" in session){
						this.task_index = (<Session>session).current_task;
					}
				});
    }


  }
