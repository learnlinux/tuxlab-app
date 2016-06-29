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
	
// LabList import	  
	import { LabList } from "../../components/lablist/lablist";
	
// Define LabsView Component
	@Component({
		selector: 'tuxlab-labview',
		templateUrl: '/client/imports/ui/pages/course/lablist.html',
		directives: [MATERIAL_DIRECTIVES,
					 MD_ICON_DIRECTIVES,
					 LabList],
		viewProviders: [MdIconRegistry],
		encapsulation: ViewEncapsulation.None
	})

// Export LabsView Class 
	export class LabView {

		constructor(mdIconRegistry: MdIconRegistry) {
			// Create Icon Font
			mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
			mdIconRegistry.setDefaultFontSetClass('tuxicon');
			
			// Display Course Toolbar
			document.getElementById('course-toolbar').style.display = "block";
			
			// Activate toolbar button
			document.getElementById('toolbar-labs').className += "active-button";
			
			document.getElementById('tux-content').style.marginTop = "20px";
		}
	}