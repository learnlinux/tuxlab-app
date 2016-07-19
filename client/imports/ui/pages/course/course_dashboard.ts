// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Mongo } from 'meteor/mongo';
	import 'reflect-metadata';
	import 'zone.js/dist/zone';

// Angular Imports
	import { Component, ViewEncapsulation, provide } from '@angular/core';
	import { bootstrap } from 'angular2-meteor-auto-bootstrap';
	import { APP_BASE_HREF } from '@angular/common';
	import { HTTP_PROVIDERS } from '@angular/http';
	import { InjectUser } from 'angular2-meteor-accounts-ui';
	import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MeteorComponent } from 'angular2-meteor';
	import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';

// Icon
  	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// LabList and Grades import
	import { LabList } from "../../components/lablist/lablist.ts";
  import { GradeList } from "../../components/gradelist/gradelist.ts";

// Courses and Course Record Imports
	import { courses } from "../../../../../collections/courses.ts";
	import { course_records } from "../../../../../collections/course_records.ts";

// Define CourseDashboard Component
	@Component({
		selector: 'tuxlab-course-dashboard',
		templateUrl: '/client/imports/ui/pages/course/course_dashboard.html',
		directives: [
			MATERIAL_DIRECTIVES,
			MD_ICON_DIRECTIVES,
			ROUTER_DIRECTIVES,
			LabList,
      GradeList
		],
		viewProviders: [MdIconRegistry],
		providers: [OVERLAY_PROVIDERS],
		encapsulation: ViewEncapsulation.None
	})

// Export CourseDashboard Class
  export class CourseDashboard extends MeteorComponent {
    course;
    courseNumber: String = '15-131'; // TODO: Get from URL
    courseDescription: String = "Course Description Not Found";
    courseName: String = "Course Name Not Found";

    constructor(mdIconRegistry: MdIconRegistry) {
      super();
      // Create Icon Font
      mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
      mdIconRegistry.setDefaultFontSetClass('tuxicon');

      // Subscribe to courses database and set current course
      this.subscribe('user-courses', this.courseNumber, () => {
        this.course = courses.findOne({ course_number: this.courseNumber });
        if (typeof this.course !== "undefined") {
          this.courseName = this.course.course_name;
          this.courseDescription = this.course.course_description.content;
        }
      }, true);
    }
  }
