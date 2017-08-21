// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';

// Define Dashboard Component
  import template from "./admin_view.component.html";
  import style from "./admin_view.component.scss";

  @Component({
    selector: 'tuxlab-admin-view',
    template,
    styles: [ style ]
  })

  export class AdminView extends MeteorComponent {
    constructor() {
      super();
    }
  }
