// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';

// Define Dashboard Component
  import template from "./help.component.html";
  import style from "./help.component.scss";

  @Component({
    selector: 'tuxlab-help',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class Help extends MeteorComponent {
    constructor() {
      super();
    }
  }
