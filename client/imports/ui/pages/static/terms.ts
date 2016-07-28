// Meteor Imports
  import { Meteor } from 'meteor/meteor';

// Angular Imports
  import { Component } from '@angular/core';

// Angular Material Imports
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MeteorComponent } from 'angular2-meteor';

// Define Terms Component
  @Component({
    selector: 'tuxlab-terms',
    templateUrl: '/client/imports/ui/pages/static/terms.html',
  })

export default class Terms extends MeteorComponent {
  constructor() {
    super();

  }
}
