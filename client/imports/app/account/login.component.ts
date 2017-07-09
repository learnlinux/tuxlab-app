// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Router } from '@angular/router';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';

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

    constructor(private accountService : AccountService, private router: Router) {
			super();
    }

		private login(username : string, password : string){
			let self = this;
			self.error = false;

			// Call Login Service
			this.accountService.loginWithPassword(username, password)

			// Redirect to Dashboard
			.then(function(){
				this.router.navigate(['/']);
			})

			// Handle Errors
			.catch(function(error){
					self.error = true;
					self.errorText = "Invalid Login. Try Again."
			})
		}

		private forgotPassword(username : string){

		}
  }
