// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';
	import { ActivatedRoute } from '@angular/router';

// Define Dashboard Component
  import template from "./error.component.html";
  import style from "./error.component.scss";

  @Component({
    selector: 'tuxlab-error',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class ErrorPage extends MeteorComponent {
    constructor(route: ActivatedRoute) {
      super();
    }
  }
