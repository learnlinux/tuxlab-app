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

// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MeteorComponent } from 'angular2-meteor';
	import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';

// Icon
  	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// LabList and Grades import
	import { LabList } from "../../components/lablist/lablist";
	import { GradeList } from "../../components/gradelist/gradelist";

// Courses and Course Record Imports
	import { courses } from "../../../../../collections/courses";
	import { course_records } from "../../../../../collections/course_records";

// Define CourseView Component
	@Component({
		selector: 'tuxlab-courseview',
		templateUrl: '/client/imports/ui/pages/course/course.html',
		directives: [
			MATERIAL_DIRECTIVES,
			MD_ICON_DIRECTIVES,
			LabList,
			GradeList
		],
		viewProviders: [MdIconRegistry],
		providers: [OVERLAY_PROVIDERS],
		encapsulation: ViewEncapsulation.None
	})

// Export CourseView Class
    export class CourseView extends MeteorComponent {
			course;
			courseNumber: String = '15-322'; // TODO: Get from URL
			courseDescription: String = "Course Description Not Found";
			courseName: String = "Course Name Not Found";

			constructor(mdIconRegistry: MdIconRegistry) {
				super();
        // Create Icon Font
        mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
        mdIconRegistry.setDefaultFontSetClass('tuxicon');

        // Display Course Toolbar
        document.getElementById('course-toolbar').style.display = "block";

        // Activate toolbar button
        document.getElementById('toolbar-course').className += " active-button";

            this.setCourse(this.courseNumber);
        }

        // Method to Subscribe to courses database and set the current course
        setCourse(courseNumber) {
          this.subscribe('user-courses', courseNumber, () => {
						console.log('haha');
            this.course = courses.findOne({ course_number: courseNumber });
              if (this.course !== undefined) {
                this.courseName = this.course.course_name;
                this.courseDescription = this.course.course_description;
              }
          }, true);
        }
    }
