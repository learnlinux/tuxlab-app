// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Accounts } from 'meteor/accounts-base';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';
	import { ActivatedRoute } from '@angular/router';

// Define Dashboard Component
  import template from "./reset.component.html";
  import style from "./reset.component.scss";

  @Component({
    selector: 'tuxlab-reset',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class Reset extends MeteorComponent {
    private token : string;

    constructor(private route: ActivatedRoute) {
      super();
    }

    ngOnInit(){

      // Get Token
      this.route.queryParamMap
        .map(params => params.get('token') || '')
        .subscribe((token) => {
          this.token = token;
        })
    }

		onSubmit(res){
			if(this.token){
				this.resetPassword(res);
			} else {
				this.changePassword(res);
			}
		}

		resetPassword({newPass, confirmPass}){
			Accounts.resetPassword(this.token, newPass);
		}

		changePassword({oldPass, newPass, confirmPass}){
			if(newPass !== confirmPass){
				throw new Error("Passwords did not match.");
			}

			Accounts.changePassword(oldPass, newPass);
		}
  }
