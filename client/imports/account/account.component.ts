// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Accounts } from 'meteor/accounts-base';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component, NgZone } from '@angular/core';
	import { Router, ActivatedRoute } from '@angular/router';

// Collections
  import { User } from '../../../both/models/user.model';
  import { Users } from '../../../both/collections/user.collection';

// Define Dashboard Component
  import template from "./account.component.html";
  import style from "./account.component.scss";

  @Component({
    selector: 'tuxlab-account',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export class AccountView extends MeteorComponent {
    private user : User;

    constructor(private zone : NgZone, private router : Router) {
      super();
    }

    ngOnInit(){

      // Get User
      this.zone.run(() => {
        this.user = <User>Meteor.user();
      });
    }

		resetPassword(){
			this.router.navigate(['/account','reset']);
		}

		deleteAccount(){
			Meteor.call('Users.remove', { user_id : Meteor.userId()}, () => {
				this.router.navigate(['/']);
			})
		}
  }
