// Meteor Imports
  import { MeteorComponent } from 'angular2-meteor';
  
// Angular Imports
  import { Component } from '@angular/core';

// Define LabView Component
  @Component({
    selector: 'tuxlab-gradeview',
    templateUrl: '/client/imports/ui/pages/course/gradeview.html' 
  })

// Export GradeView Class
  export class GradeView extends MeteorComponent {
    constructor() {
      super();
    }
  }