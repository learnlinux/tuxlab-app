// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Mongo }       from 'meteor/mongo';
	import 'reflect-metadata';
	import 'zone.js/dist/zone';

// Angular Imports
	import { Component, ViewEncapsulation, provide } from '@angular/core';
	import { bootstrap } from 'angular2-meteor-auto-bootstrap';
	import { APP_BASE_HREF, FORM_DIRECTIVES } from '@angular/common';
	import { HTTP_PROVIDERS } from '@angular/http';
	import { InjectUser } from 'angular2-meteor-accounts-ui';

// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MeteorComponent } from 'angular2-meteor';
	import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs'
	import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
	import { MdToolbar } from '@angular2-material/toolbar';

// Icon
	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// Define ExploreView Component
	@Component({
		selector: 'tuxlab-exploreview',
		templateUrl: '/client/imports/ui/components/explore/explore.html',
		directives: [ MATERIAL_DIRECTIVES, 
					  MD_ICON_DIRECTIVES, 
					  MD_TABS_DIRECTIVES,
					  MD_INPUT_DIRECTIVES,
					  MdToolbar ],
		viewProviders: [ MdIconRegistry ],
		encapsulation: ViewEncapsulation.None
	})
	
// Export ExploreView Class 
export class ExploreView extends MeteorComponent {
		
	courses: Array<any> = [
		{
			'id': '1', 
			'courseName': 'Great Practical Ideas for Computer Scientists', 
			'description': `
				Throughout your education as a Computer Scientist at 
				Carnegie Mellon, you will take courses on programming, 
				theoretical ideas, logic, systems, etc. As you progress, 
				you will be expected to pick up the so-called “tools of 
				the trade.” This course is intended to help you learn 
				what you need to know in a friendly, low-stress, 
				high-support way. We will discuss UNIX, LaTeX, debugging 
				and many other essential tools.
			`, 
			'syllabus': 'This is supposed to be the syllabus.', 
			'content': 'This is the course content of GPI.'
		},
		{
			'id': '2', 
			'courseName': 'Great Theoretical Ideas in Computer Science', 
			'description': 'This course will blow your mind', 
			'syllabus': 'Fail to be amazing and you will fail the course.', 
			'content': 'This is the course content of GTI.'
		},
		{
			'id': '3', 
			'courseName': 'Principles of Functional Programming', 
			'description': 'This course will teach you how to program functionally.', 
			'syllabus': 'You will scrape by with a course average of 90%.', 
			'content': 'We will be using SML.'
		}
	];
	
	constructor(mdIconRegistry: MdIconRegistry) {
		super();
		// Create Icon Font
		mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
		mdIconRegistry.setDefaultFontSetClass('tuxicon');
	}
	
}

