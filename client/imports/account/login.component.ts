// Meteor Imports
	import * as _ from "lodash";

	import { Meteor } from 'meteor/meteor';
	import { Observable } from 'rxjs/Observable';
	import 'rxjs/add/operator/map';
	import 'rxjs/add/operator/last';

// Angular Imports
	import { Component } from '@angular/core';
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
							  private route: ActivatedRoute) {

			super();
    }

		private redirect_url : string;
		ngOnInit(){
			this.route.data
				.map(data => data["redirect_url"] || '/dashboard')
				.subscribe(redirect_url => this.redirect_url = redirect_url)
		}

		private login({username, password}){
			this.error = false;

			// Call Login Service
			this.accountService.loginWithPassword(username, password)

			// Redirect
			.then(() =>{
				console.log(this.redirect_url);
				this.router.navigateByUrl(this.redirect_url);
			})

			// Handle Errors
			.catch((error) => {
					console.error(error);
					this.error = true;
					this.errorText = "Invalid Login. Try Again."
			})
		}

		private forgotPassword(username : string){

		}
  }
