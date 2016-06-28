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
	
// Editor Component
	import { Editor } from '../../components/editor/editor';

// Define InstructorView Component
	@Component({
		selector: 'tuxlab-instructor',
		templateUrl: '/client/imports/ui/pages/instructor/instructor.html',
		directives: [ 
			MATERIAL_DIRECTIVES, 
			MD_ICON_DIRECTIVES, 
			MD_SIDENAV_DIRECTIVES,
			Editor
		],
		viewProviders: [ MdIconRegistry ],
		encapsulation: ViewEncapsulation.None
	})

// Export Instructor Class 
export class Instructor extends MeteorComponent {
	
	constructor(mdIconRegistry: MdIconRegistry) {
		super();
		
		// Create Icon Font
		mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
		mdIconRegistry.setDefaultFontSetClass('tuxicon');
		
	}
	
}

