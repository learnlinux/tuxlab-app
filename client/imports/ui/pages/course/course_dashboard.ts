// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';

// Angular Imports
  import { Component, ViewEncapsulation, provide, OnInit } from '@angular/core';
  import { bootstrap } from 'angular2-meteor-auto-bootstrap';
  import { APP_BASE_HREF, FORM_DIRECTIVES } from '@angular/common';
  import { HTTP_PROVIDERS } from '@angular/http';
  import { InjectUser } from 'angular2-meteor-accounts-ui';
  import { ROUTER_DIRECTIVES, ActivatedRoute, Router, RouterState } from '@angular/router';

// Angular Material Imports
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MeteorComponent } from 'angular2-meteor';
  import { OVERLAY_PROVIDERS } from '@angular2-material/core/overlay/overlay';
  import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';

// Icon
  import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// LabList and Grades import
  import { GradeList } from './gradelist.ts';
  import { LabList } from './lablist.ts';
  
// Roles Import
  import { Roles } from '../../../../../collections/users.ts';

declare var Collections: any;

// Define CourseDashboard Component
  @Component({
    selector: 'tuxlab-course-dashboard',
    templateUrl: '/client/imports/ui/pages/course/course_dashboard.html',
    directives: [
      MATERIAL_DIRECTIVES,
      MD_ICON_DIRECTIVES,
      ROUTER_DIRECTIVES,
      FORM_DIRECTIVES,
      MD_INPUT_DIRECTIVES,
      LabList,
      GradeList
    ],
    viewProviders: [MdIconRegistry],
    providers: [ OVERLAY_PROVIDERS ],
    encapsulation: ViewEncapsulation.None
  })

// Export CourseDashboard Class
  export class CourseDashboard extends MeteorComponent {
    course;
    courseId: string;
    courseDescription: string = "";
    courseName: string = "";

    constructor(private route: ActivatedRoute, private router: Router) {
      super();
      // Subscribe to courses database and set current course
      this.subscribe('user-courses', this.courseId, () => {
        this.course = Collections.courses.findOne({ _id: this.courseId });
        if (typeof this.course !== "undefined") {
          this.courseName = this.course.course_name;
          this.courseDescription = this.course.course_description.content;
        }
      }, true);
    }
    ngOnInit() {
      this.courseId = this.router.routerState.parent(this.route).snapshot.params['courseid'];
    }
  }
