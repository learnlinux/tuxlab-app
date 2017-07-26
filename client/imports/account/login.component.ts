// Meteor Imports
	import * as _ from "lodash";

	import { Meteor } from 'meteor/meteor';
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/map';
	import 'rxjs/add/operator/last';

// Angular Imports
	import { Component, NgZone } from '@angular/core';
	import { NgForm } from '@angular/forms';
	import { Router, ActivatedRoute } from '@angular/router';
	import { MeteorComponent } from 'angular2-meteor';

// Define Dashboard Component
  import template from "./login.component.html";
  import style from "./login.component.scss";

// Account Service
	import AccountService from './account.service';

// Login Class
  @Component({
    selector: 'tuxlab-login',
    template,
    styles: [ style ]
  })
  export default class Login extends MeteorComponent {
		private error : boolean;
		private errorText : string;

    constructor(private accountService : AccountService,
							  private router: Router,
							  private route: ActivatedRoute,
								private zone: NgZone ) {

			super();
    }

		private redirect_url : string;
		private google : boolean = false;

		ngOnInit(){
			// Get Redirect URL
			this.route.data
				.map(data => data["redirect_url"] || '/dashboard')
				.subscribe(redirect_url => this.redirect_url = redirect_url);

			// Wait for Settings
			Meteor.startup(() => {
				this.zone.run(() => {
					this.google = _.has(Meteor,'settings.public.oAuth.google');
				})
			});

		}

		private login({username, password}){
			this.error = false;

			// Call Login Service
			this.accountService.loginWithPassword(username, password)

			// Redirect
			.then(() =>{
				this.router.navigateByUrl(this.redirect_url);
			})

			// Handle Errors
			.catch((error) => {
					console.error(error);
					this.error = true;
					this.errorText = "Invalid Login. Try Again."
			})
		}

		private LoginWithGoogle(){
			this.accountService.loginWithGoogle()
			.then(() => {
				this.router.navigateByUrl(this.redirect_url);
			})
			.catch((error) => {
				console.error(error);
				this.error = true;
				this.errorText = "Couldn't Authenticate with Google.";
			})
		}
  }
