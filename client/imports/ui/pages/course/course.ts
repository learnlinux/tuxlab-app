// Meteor Imports
  import { Meteor } from 'meteor/meteor';

// Angular Imports
  import { Component } from '@angular/core';
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
			ROUTER_DIRECTIVES
		]
	})

@InjectUser('user')
// Export CourseView Class
  export default class CourseView extends MeteorComponent {
    courseId: string;
    courseNumber: string = "";
    user: Meteor.User;

    constructor(private route: ActivatedRoute) {
      super();

      this.subscribe('user-courses', () => {
        this.autorun(() => {
          this.courseNumber = Collections.courses.findOne({ _id: this.courseId }).course_number;
        });
      }, true);
    }
    ngOnInit() {
      this.courseId = (<any>(this.route.snapshot.params)).courseid;
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
