// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component, NgZone } from '@angular/core';

// Admin Settings Component
  import template from "./admin_settings.component.html";
  import style from "./admin_settings.component.scss";

  @Component({
    selector: 'tuxlab-admin-settings',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export class AdminSettings extends MeteorComponent {
		private settings : any;
		private edit_mode : boolean = false;

    constructor(private zone : NgZone) {
      super();
    }

		ngOnInit(){
			Meteor.call('Settings.get', (err, res) => {
				this.settings = JSON.stringify(res, null, 2);
			})
		}

		update(){
			Meteor.call('Settings.set', JSON.parse(this.settings), () => {
				this.edit_mode = false;
			});
		}
  }
