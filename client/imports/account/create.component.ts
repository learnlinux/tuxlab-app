// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Accounts } from 'meteor/accounts-base';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';

// Define Dashboard Component
  import template from "./create.component.html";
  import style from "./create.component.scss";

  @Component({
    selector: 'tuxlab-create',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class CreateUser extends MeteorComponent {
    constructor() {
      super();
    }

		createAccount({username, name, email, newPass, confirmPass}){
			if(newPass !== confirmPass){
				throw new Error("Passwords did not match.");
			}

			Accounts.createUser({
				username : username,
				email : email,
				password : newPass,
				profile : {
					name : name
				}
			});
		}
  }
