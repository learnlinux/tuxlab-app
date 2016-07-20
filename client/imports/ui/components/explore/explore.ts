// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Mongo } from 'meteor/mongo';
	import 'reflect-metadata';
	import 'zone.js/dist/zone';

// Angular Imports
	import { Component, ViewEncapsulation, provide } from '@angular/core';
	import { bootstrap } from 'angular2-meteor-auto-bootstrap';
	import { APP_BASE_HREF, FORM_DIRECTIVES } from '@angular/common';
	import { HTTP_PROVIDERS } from '@angular/http';
	import { InjectUser } from 'angular2-meteor-accounts-ui';
	import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MeteorComponent } from 'angular2-meteor';
	import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs'
	import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
	import { MdToolbar } from '@angular2-material/toolbar';

// Icon
	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// Courses Imports
	import { courses } from '../../../../../collections/courses.ts';

// Define ExploreView Component
	@Component({
		selector: 'tuxlab-exploreview',
		templateUrl: '/client/imports/ui/components/explore/explore.html',
		directives: [
			MATERIAL_DIRECTIVES,
			MD_ICON_DIRECTIVES,
			MD_TABS_DIRECTIVES,
			ROUTER_DIRECTIVES,
			MD_INPUT_DIRECTIVES,
			MdToolbar
		],
		viewProviders: [ MdIconRegistry ],
		encapsulation: ViewEncapsulation.None
	})

// Export ExploreView Class
export class ExploreView extends MeteorComponent {

	courses: Array<any> = [];

	constructor(mdIconRegistry: MdIconRegistry) {
		super();
		// Create Icon Font
		mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
		mdIconRegistry.setDefaultFontSetClass('tuxicon');

		this.subscribe('explore-courses', () => {
			this.courses = courses.find().fetch();
		}, true);
	}
}
