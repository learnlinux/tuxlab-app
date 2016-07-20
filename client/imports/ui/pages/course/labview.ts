// Meteor Imports
  import { MeteorComponent } from 'angular2-meteor';
  
// Angular Imports
  import { Component } from '@angular/core';

// Define LabView Component
  @Component({
    selector: 'tuxlab-labview',
    templateUrl: '/client/imports/ui/pages/course/labview.html' 
  })

// Export LabView Class
  export class LabView extends MeteorComponent {
    constructor() {
      super();
    }
  }