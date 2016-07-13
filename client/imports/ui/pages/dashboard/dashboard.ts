// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Mongo }       from 'meteor/mongo';
	import { MeteorComponent } from 'angular2-meteor';
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
	import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';

// Icon
	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// Define Dashboard Component
	@Component({
		selector: 'tuxlab-dashboard',
		templateUrl: '/client/imports/ui/pages/dashboard/dashboard.html',
		directives: [
			MATERIAL_DIRECTIVES,
			MD_ICON_DIRECTIVES,
			MD_SIDENAV_DIRECTIVES
		],
		viewProviders: [ MdIconRegistry ],
		encapsulation: ViewEncapsulation.None
	})

// Export Dashboard Class
export default class Dashboard extends MeteorComponent {
	courses: Array<any> = [
		{'id': 1, 'number': '15-131', 'name': 'Great Practical Ideas for Computer Scientists', 'quantity': '12', 'grade': '99'},
		{'id': 7, 'number': '21-299', 'name': 'Calculus in Twelve Dimensions', 'quantity': '76', 'grade': '100'},
		{'id': 9, 'number': '15-999', 'name': 'Introduction to Linux', 'quantity': '44', 'grade': '98'},
		{'id': 10, 'number': '15-998', 'name': 'Vim Usage', 'quantity': '1', 'grade': '99'},
		{'id': 11, 'number': '15-000', 'name': 'Emacs Usage', 'quantity': '2', 'grade': '44'},
		{'id': 12, 'number': '15-997', 'name': 'Bash Commands', 'quantity': '3', 'grade': '85'}
	];

	constructor(mdIconRegistry: MdIconRegistry) {
		super();

		// Create Icon Font
		mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
		mdIconRegistry.setDefaultFontSetClass('tuxicon');
	}

	toCourse(courseId) {
		console.log('Going to course page with course id: ' + courseId);
		window.location.href = '/course';
	}



}
