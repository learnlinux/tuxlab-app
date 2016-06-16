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
	
// Icon
  	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';
	
// Define Grades Component
	@Component({
		selector: 'tuxlab-gradelist',
		templateUrl: '/client/imports/ui/components/gradelist/gradelist.html',
		directives: [MATERIAL_DIRECTIVES,
					 MD_ICON_DIRECTIVES],
		viewProviders: [MdIconRegistry],
		encapsulation: ViewEncapsulation.None
	})

// Export Grades Class 
	export class GradeList {

		grades: Array<any> = [
			{'id': 1, 'name': 'Exam 1', 'grade': '95%'},
			{'id': 2, 'name': 'Exam 2', 'grade': '99%'},
			{'id': 3, 'name': 'Exam 3', 'grade': '100%'},
			{'id': 4, 'name': 'Final Exam', 'grade': '97%'}
		];

		constructor(mdIconRegistry: MdIconRegistry) {
			// Create Icon Font
			mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
			mdIconRegistry.setDefaultFontSetClass('tuxicon');		
		}
	}
	
