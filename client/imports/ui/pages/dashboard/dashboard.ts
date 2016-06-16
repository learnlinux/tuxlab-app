// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Mongo }       from 'meteor/mongo';
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

// Icon
	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// Define Dashboard Component
	@Component({
		selector: 'tuxlab-dashboard',
		templateUrl: '/client/imports/ui/pages/dashboard/dashboard.html',
		directives: [ MATERIAL_DIRECTIVES, MD_ICON_DIRECTIVES ],
		viewProviders: [ MdIconRegistry ],
		encapsulation: ViewEncapsulation.None
	})

// Export Dashboard Class 
export class Dashboard extends MeteorComponent {
	constructor(mdIconRegistry: MdIconRegistry) {
		super();
		// Create Icon Font
		mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
		mdIconRegistry.setDefaultFontSetClass('tuxicon');
	}
}

