// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';

// Define Dashboard Component
  import template from "./dashboard.component.html";
  import style from "./dashboard.component.scss";

  @Component({
    selector: 'tuxlab-dashboard',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class Dashboard extends MeteorComponent {
    constructor() {
      super();
    }
  }
