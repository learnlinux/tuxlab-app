// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';

// Define Dashboard Component
  import template from "./login.component.html";
  import style from "./login.component.scss";

  @Component({
    selector: 'tuxlab-login',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class Login extends MeteorComponent {
    constructor() {
      super();
    }
  }
