// Meteor Imports
	import { Meteor } from 'meteor/meteor';

// Angular Imports
	import { Component, ElementRef, ViewChild } from '@angular/core';

// Angular Material Imports
	import { MeteorComponent } from 'angular2-meteor';

// Declare Global Variable
	var SimpleMDE : any = require('simplemde');

// Define Editor Component
	@Component({
		selector: 'tuxlab-mdeditor',
		templateUrl: '/client/imports/ui/components/mdeditor/mdeditor.html',
	})

// Export Editor Class
	export class MDEditor extends MeteorComponent {
		@ViewChild('simplemde') textarea : ElementRef;

		constructor(private elementRef:ElementRef) {
			super();
		}

		ngAfterViewInit(){
			// Instantiate SimpleMDE
			var mde = new SimpleMDE({ element: this.elementRef.nativeElement.value });
		}


	}
