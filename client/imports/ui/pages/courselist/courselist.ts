// Meteor imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';

// Angular Imports
  import { Component } from '@angular/core'
  import { ROUTER_DIRECTIVES, Router } from '@angular/router';

// Angular Meteor Imports
  import { MeteorComponent } from 'angular2-meteor';
  
// Angular Material Imports
  import { MATERIAL_DIRECTIVES } from 'ng2-material';

// Declare Collections
  declare var Collections: any;

// Define CourseList Component
  @Component({
    selector: 'tuxlab-courselist',
    templateUrl : '/client/imports/ui/pages/courselist/courselist.html',
    directives: [ 
      MATERIAL_DIRECTIVES,
      ROUTER_DIRECTIVES 
    ] 
  })

// Export CourseList Class
  export default class CourseList extends MeteorComponent {
    courses: Array<Object> = [];
    constructor(private router: Router) {
      super();
      // Subscribe from user courses
      this.subscribe('user-courses', () => {
        this.courses = Collections.courses.find().fetch();
      }, true);
    }
    toCourse(course: Object) {
      this.router.navigate(['/course', (<any>course)._id]);
    }
  }