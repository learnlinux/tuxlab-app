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
	import { MdProgressBar } from '@angular2-material/progress-bar';

// Icon
  	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';
	
// Define LabList Component
	@Component({
		selector: 'tuxlab-lablist',
		templateUrl: '/client/imports/ui/components/lablist/lablist.html',
		directives: [MATERIAL_DIRECTIVES,
					 MD_ICON_DIRECTIVES,
					 MdProgressBar],
		viewProviders: [MdIconRegistry],
		encapsulation: ViewEncapsulation.None
	})

// Export LabList Class 
	export class LabList {
		// Progress Bar Value
		public determinateValue: number = 30;

		labs: Array<any> = [
			{'id': 1, 'name': 'Lab1', 'comp': '10/10', 'date': 'Sept. 3rd'},
			{'id': 2, 'name': 'Lab2', 'comp': '10/10', 'date': 'Sept. 10th'},
			{'id': 3, 'name': 'Lab3', 'comp': '1/10', 'date': 'Sept. 17th'},
			{'id': 4, 'name': 'Lab4', 'comp': '0/10', 'date': 'Sept. 24th'},
			{'id': 5, 'name': 'Lab5', 'comp': '0/10', 'date': 'Oct. 1st'},
			{'id': 6, 'name': 'Lab6', 'comp': '0/10', 'date': 'Oct. 8th'}
		];
		
		// Link to lab function
		toLab(lab) {
			console.log("Redirecting to " + lab + "page.");
			window.location.href = "/lab";
		}

		constructor(mdIconRegistry: MdIconRegistry) {
			// Create Icon Font
			mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
			mdIconRegistry.setDefaultFontSetClass('tuxicon');
			
			
		}
	}
	
