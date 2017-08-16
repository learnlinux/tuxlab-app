// Imports
	import { MeteorComponent } from 'angular2-meteor';
	import { Component, NgZone,  } from '@angular/core';
	import { BehaviorSubject } from 'rxjs/BehaviorSubject';
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/map';
	import 'rxjs/add/operator/debounce';

	import { Router, ActivatedRoute } from "@angular/router";
	import { MdDialogRef } from "@angular/material";

// Define Dialog Component
	import style from "./select_user.dialog.scss";
	import template from "./select_user.dialog.html";

// Collections
	import { User } from '../../../both/models/user.model';

  //  ConnectionDialog Class
	@Component({
		selector: 'tuxlab-select-user',
		template: template,
		styles: [ style ]
	})
	export default class SelectUser extends MeteorComponent {
		private search : BehaviorSubject<string>;
		private query : string = "";
		private results : User[];

		constructor(public dialogRef: MdDialogRef<SelectUser>, private zone : NgZone){
			super();
		}

		ngOnInit(){
			this.search = new BehaviorSubject("");
			this.search
				.distinct()
				.debounce(function (x) { return Observable.timer(700); })
				.subscribe((query) => {
					Meteor.call("Users.searchByProfileFields",{query : query},(err, res) => {
						this.zone.run(() => {
							if(err){
								console.error(err);
							}
							this.results = res;
						})
					})
				});
		}

		onUpdate(){
			this.search.next(this.query);
		}

		select(user){
			this.dialogRef.close(user);
		}

	}
