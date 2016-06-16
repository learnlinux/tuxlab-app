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
		
// Toolbar
  	import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
	import "../../../../../node_modules/@angular2-material/toolbar/toolbar.css";

// Icon
  	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'
	
// Define Tasks Collection
	let Tasks = new Mongo.Collection('Tasks');
	
// Define Markdown Component
	@Component({
		selector: 'tuxlab-markdown',
		templateUrl: '/client/imports/ui/components/markdown/markdown.html',
		directives: [MATERIAL_DIRECTIVES,
					 MD_TOOLBAR_DIRECTIVES,
					 MD_ICON_DIRECTIVES],
		viewProviders: [MdIconRegistry],
		encapsulation: ViewEncapsulation.None
	})

// Export MarkdownView Class 
	export class MarkdownView {
		constructor(mdIconRegistry: MdIconRegistry) {
			// Create Icon Font
			mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
			mdIconRegistry.setDefaultFontSetClass('tuxicon');
			
			// Subscribe to markdown
			Meteor.subscribe('markdown', () => {
				let task = Tasks.findOne({ task_name: 'task7' });
				if (!task.task_markdown) {
					throw "Task does not exist";
				}
				else {
					let mdTask = task.task_markdown;
					document.getElementById('task-markdown').innerHTML = mdTask;
				}
			});
		}
		
		// Check Button
		check() {
			alert('You will fail this class.');
		}
	}