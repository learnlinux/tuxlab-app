// Meteor Imports
	import * as _ from "lodash";
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/map';
	import 'rxjs/add/operator/distinct';
	import 'rxjs/add/operator/mergeMap';

	import { Meteor } from 'meteor/meteor';
	import { Tracker } from 'meteor/tracker';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component, Input, ViewChild, NgZone } from '@angular/core';
	import { Router, ActivatedRoute } from "@angular/router";
	import { MdDialog } from '@angular/material';
	import { ObservableCursor } from 'meteor-rxjs';

// Define Lab View Component
	import template from "./lab_view.component.html";
	import style from "./lab_view.component.scss";

// Define Dialog Component
	import style_dialog from "./lab_view_connection_dialog.scss";
	import template_dialog from "./lab_view_connection_dialog.html";

// Markdown Styles
	import prism_style from "prismjs/themes/prism.css";

// Import Lab Data
	import { Lab } from '../../../both/models/lab.model';
	import { Labs } from '../../../both/collections/lab.collection';
	import { Container, Session } from '../../../both/models/session.model';
	import { Sessions } from '../../../both/collections/session.collection';

// Lab Terminal
	import LabTerminal from './lab_terminal.component';

//  ConnectionDialog Class
	@Component({
		selector: 'tuxlab-lab-connection-details',
		template: template_dialog,
		styles: [ style_dialog ]
	})
	export class ConnectionDetailsDialog extends MeteorComponent {
		public container : Container;
	}

//  LabView Class
	@Component({
		selector: 'tuxlab-lab-view',
		template,
		styles: [ style ]
	})

  export class LabView extends MeteorComponent {
		@ViewChild(LabTerminal) terminal : LabTerminal;

		// Lab & Session
		private lab : Observable<Lab>;
		private session : Session;
		private task_index : number = 0;
		private container_index : number = 0;

    constructor( private router : Router,
								 private route: ActivatedRoute,
							 	 private dialog : MdDialog,
							 	 private zone : NgZone ) {
			super();
			prism_style;
    }


		// Load Data
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

				this.lab
				.filter((x) => { return _.has(x, "_id")})
				.distinct(x => x._id)
				.subscribe((lab) => {
					if(lab && lab._id){
						Meteor.call('session.getOrCreate',lab._id, (err, res) => {
							if(err){
								console.error(err);
							} else {

								// Pass Values to Session
								this.zone.run(() => {
									this.session = res;
									this.task_index = res.current_task;
								})

								// Trigger Connection if not Already
								this.ngAfterViewInit();
							}
						});
					}
				});
    }

		// Bind to Terminal Init
		private _terminal_init = false;
		ngAfterViewInit(){
			if(this.terminal && !this._terminal_init){
				this.terminal.bindSocket();
				this._terminal_init = true;
			}
		}

		// Connection Details
		private connectionDetails(){
			var dialogRef = this.dialog.open(ConnectionDetailsDialog, { width: '600px' });
			dialogRef.componentInstance.container = this.session.containers[this.container_index];
		}

		// Refresh
		private refresh(){
			location.reload();
		}

		private prevTask(){
			this.zone.run(() => {
				this.task_index = (this.task_index > 0) ? this.task_index - 1 : this.task_index;
			})
		}

		private nextTask(){
			this.zone.run(() => {
				this.task_index++;
			})
		}


		// Check Task Status
		private checkTask(){
			return new Promise((resolve, reject) => {
				Meteor.call('session.nextTask', this.session.lab_id, (err, res) => {
					if(err){
						reject(err);
					} else {
						resolve(res);
					}
				})
			})

			// Set Observable<Session>
			.then((res : Session) => {
				this.zone.run(() => {
					this.session = res;
				})
			})
		}
  }
