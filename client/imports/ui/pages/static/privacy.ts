// Meteor Imports
  import { Meteor } from 'meteor/meteor';

// Angular Imports
  import { Component } from '@angular/core';

// Angular Material Imports
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MeteorComponent } from 'angular2-meteor';

// Define Privacy Component
  @Component({
    selector: 'tuxlab-privacy',
    templateUrl: '/client/imports/ui/pages/static/privacy.html',
  })

export default class Privacy extends MeteorComponent {
  constructor() {
    super();
  }
}
