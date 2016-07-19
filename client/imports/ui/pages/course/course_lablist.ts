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

// Courses and Course Record Imports
	import { courses } from "../../../../../collections/courses.ts";
	import { course_records } from "../../../../../collections/course_records.ts";

// Define CourseLabList Component
	@Component({
		selector: 'tuxlab-course-lablist',
    template: `
      <div class="tuxlab-course-lablist">
        <tuxlab-lablist></tuxlab-lablist>
      </div>
    `,
		directives: [
			MATERIAL_DIRECTIVES,
			MD_ICON_DIRECTIVES,
			ROUTER_DIRECTIVES,
			LabList
		],
		viewProviders: [MdIconRegistry],
		providers: [OVERLAY_PROVIDERS],
		encapsulation: ViewEncapsulation.None
	})

// Export CourseLabList Class
  export class CourseLabList extends MeteorComponent {
    constructor(mdIconRegistry: MdIconRegistry) {
      super();
      // Create Icon Font
      mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
      mdIconRegistry.setDefaultFontSetClass('tuxicon');
    }
  }
