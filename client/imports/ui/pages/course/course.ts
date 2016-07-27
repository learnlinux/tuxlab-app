// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';

// Angular Imports
  import { Component, ViewEncapsulation, provide, OnInit } from '@angular/core';
  import { bootstrap } from 'angular2-meteor-auto-bootstrap';
  import { APP_BASE_HREF } from '@angular/common';
  import { HTTP_PROVIDERS } from '@angular/http';
  import { InjectUser } from 'angular2-meteor-accounts-ui';
  import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

// Angular Material Imports
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MeteorComponent } from 'angular2-meteor';
  import { OVERLAY_PROVIDERS } from '@angular2-material/core/overlay/overlay';

// Icon
  import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';
  
// Roles
  import { Roles } from '../../../../../collections/users.ts';

  declare var Collections: any;

// Define CourseView Component
	@Component({
		selector: 'tuxlab-courseview',
		templateUrl: '/client/imports/ui/pages/course/course.html',
		directives: [
			MATERIAL_DIRECTIVES,
			MD_ICON_DIRECTIVES,
			ROUTER_DIRECTIVES
		],
		viewProviders: [MdIconRegistry],
		providers: [OVERLAY_PROVIDERS],
		encapsulation: ViewEncapsulation.None
	})

@InjectUser('user')
// Export CourseView Class
  export default class CourseView extends MeteorComponent {
    courseId: string;
    courseNumber: string = "";
    isInstructor: boolean = false;
    user: Meteor.User;
    constructor(mdIconRegistry: MdIconRegistry, private route: ActivatedRoute) {
      super();
      // Create Icon Font
      mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
      mdIconRegistry.setDefaultFontSetClass('tuxicon');
      this.subscribe('user-courses', () => {
        this.autorun(() => {
          this.courseNumber = Collections.courses.findOne({ _id: this.courseId }).course_number;
        });
      }, true);
    }
    ngOnInit() {
      this.courseId = (<any>(this.route.snapshot.params)).courseid;
      if(typeof this.courseId !== "undefined") {
        this.isInstructor = Roles.isInstructorFor(this.courseId);
      }
    }
    isInstruct() {
      if(typeof this.courseId !== "undefined") {
        return Roles.isInstructorFor(this.courseId);
      }
      else {
        return false;
      }
    }
  }

