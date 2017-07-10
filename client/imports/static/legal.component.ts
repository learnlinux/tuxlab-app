// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';

// Define Dashboard Component
  import template from "./legal.component.html";
  import style from "./legal.component.scss";

  @Component({
    selector: 'tuxlab-legal',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class Legal extends MeteorComponent {
    constructor() {
      super();
    }
  }
