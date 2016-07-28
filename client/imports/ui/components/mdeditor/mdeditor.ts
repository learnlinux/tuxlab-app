// Meteor Imports
	import { Meteor } from 'meteor/meteor';

// Angular Imports
	import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';

// Angular Meteor Imports
	import { MeteorComponent } from 'angular2-meteor';

// Declare Global Variable
	var SimpleMDE : any = require('simplemde');

// Define Editor Component
	@Component({
		selector: 'tuxlab-mdeditor',
		templateUrl: '/client/imports/ui/components/mdeditor/mdeditor.html',
	})

// Export Editor Class
	export class MDEditor extends MeteorComponent implements OnChanges {
		@ViewChild('simplemde') textarea : ElementRef;
		@Input() mdData: string = "";
		@Output() mdUpdated = new EventEmitter<string>();
		public mde;
		constructor(private elementRef:ElementRef) {
			super();
		}

		ngAfterViewInit(){
			var self = this;
			// Instantiate SimpleMDE
			this.mde = new SimpleMDE({ element: this.elementRef.nativeElement.value });
			// Read initial data from task markdown
			this.mde.value(self.mdData);
			// Catch changes
			this.mde.codemirror.on("change", function() {
				self.mdData = self.mde.value();
				self.mdUpdated.emit(self.mdData);
			});
		}
		ngOnChanges(changes) {
			if(typeof this.mde !== "undefined") {
				this.mde.value(changes['mdData'].currentValue);
			}
		}

	}
