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
	
// Define CourseView Component
	@Component({
		selector: 'tuxlab-courseview',
		templateUrl: '/client/imports/ui/pages/courseview/courseview.html',
		directives: [MATERIAL_DIRECTIVES,
					 MD_ICON_DIRECTIVES,
					 LabList,
					 GradeList],
		viewProviders: [MdIconRegistry],
		providers: [OVERLAY_PROVIDERS],
		encapsulation: ViewEncapsulation.None
	})

// Export CourseView Class 
	export class CourseView {
		
		courseDescription = `
			Throughout your education as a Computer Scientist at Carnegie Mellon, 
			you will take courses on programming, theoretical ideas, logic, systems, etc. 
			As you progress, you will be expected to pick up the so-called 
			“tools of the trade.” This course is intended to help you learn what 
			you need to know in a friendly, low-stress, high-support way. We will 
			discuss UNIX, LaTeX, debugging and many other essential tools.
			`;
		
		lectures: Array<any> = [
    		{'id': 1, 'name': 'Initial Setup', 'date': 'ASAP'},
			{'id': 2, 'name': 'Terminal Usage', 'date': 'Sept. 3rd'},
			{'id': 3, 'name': 'Vim Usage', 'date': 'Sept. 10th'},
			{'id': 4, 'name': 'Bash Usage', 'date': 'Sept. 17th'},
			{'id': 5, 'name': 'Git Usage', 'date': 'Sept. 24th'},
			{'id': 6, 'name': 'Terminal Configuration', 'date': 'Oct. 1st'},
			{'id': 7, 'name': 'Final Exam Preperation', 'date': 'Oct. 2nd'}
  		];
		assignments: Array<any> = [
			{'id': 1, 'name': 'Install a Linux distribution', 'date': 'Sept. 3rd'},
			{'id': 2, 'name': 'Memorize ALL terminal commands', 'date': 'Sept. 10th'},
			{'id': 3, 'name': 'Memorize ALL Vim commands', 'date': 'Sept. 17th'},
			{'id': 4, 'name': 'Reimplement Bash', 'date': 'Sept. 24th'},
			{'id': 5, 'name': 'Memorize ALL git commands', 'date': 'Oct. 1st'},
			{'id': 6, 'name': 'Reimplement the terminal', 'date': 'Oct. 8th'}
		];

		constructor(mdIconRegistry: MdIconRegistry) {
			// Create Icon Font
			mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
			mdIconRegistry.setDefaultFontSetClass('tuxicon');
			
			// Display Course Toolbar
			document.getElementById('course-toolbar').style.display = "block";
			
			// Activate toolbar button
			document.getElementById('toolbar-course').className += " active-button";
		}
	}