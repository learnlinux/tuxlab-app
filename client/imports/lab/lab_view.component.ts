// Meteor Imports
	import * as _ from "lodash";
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/map';
	import 'rxjs/add/operator/distinct';
	import 'rxjs/add/operator/mergeMap';
	import 'rxjs/add/observable/fromPromise';

	import { Meteor } from 'meteor/meteor';
	import { Tracker } from 'meteor/tracker';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component, Input } from '@angular/core';
	import { Router, ActivatedRoute } from "@angular/router";
	import { MdDialog } from '@angular/material';
	import { ObservableCursor } from 'meteor-rxjs';

// Define Lab View Component
	import template from "./lab_view.component.html";
	import template_dialog from "./lab_view_connection_dialog.html";
  import style from "./lab_view.component.scss";
	import prism_style from "prismjs/themes/prism.css";

// Import Lab Data
	import { Lab } from '../../../both/models/lab.model';
	import { Labs } from '../../../both/collections/lab.collection';
	import { Session } from '../../../both/models/session.model';
	import { Sessions } from '../../../both/collections/session.collection';


//  ConnectionDialog Class
	@Component({
		selector: 'tuxlab-lab-connection-details',
		template: template_dialog,
		styles: [ style ]
	})
	export class ConnectionDetailsDialog extends MeteorComponent {
		public session : Observable<Session>;
	}

//  LabView Class
	@Component({
		selector: 'tuxlab-lab-view',
		template,
		styles: [ style ]
	})

  export class LabView extends MeteorComponent {
		private lab : Observable<Lab>;
		private session : Observable<Session>;

		private task_index : number;

    constructor( private router : Router,
								 private route: ActivatedRoute,
							 	 private dialog : MdDialog) {
			super();
			prism_style;
    }

		ngOnInit(){

				// Lab
				this.lab = this.route.params
					.map(params => [params['course_id'], params['lab_id']])
					.distinct()
					.mergeMap(([course_id, lab_id]) => {

						return Observable.fromPromise(
							new Promise((resolve, reject) => {
								Meteor.subscribe('labs.course',course_id, () => {
									var lab = Labs.findOne({ _id : lab_id });
									if(_.isNull(lab)){
										console.error("Lab Not Found");
									} else {
										resolve(lab);
									}
								});
							})
						);
					});

				// Session
				this.session = this.lab
				.filter((x) => { return _.has(x, "_id")})
				.distinct(x => x._id)
				.mergeMap((lab) => {
					if(lab && lab._id){
						return Observable.fromPromise(
							new Promise((resolve, reject) => {
								Meteor.call('session.getOrCreate',lab._id, (err, res) => {
									if(err){
										reject(err);
									} else {
										this.task_index = res.current_task;
										resolve(res);
									}
								});
						}));
					}
				});
    }

		private openConnectionDetails(){
			var dialogRef = this.dialog.open(ConnectionDetailsDialog);
					dialogRef.componentInstance.session = this.session;
		}
  }
