// Imports
	import { MeteorComponent } from 'angular2-meteor';
	import { Component, Inject } from '@angular/core';
  import { MD_DIALOG_DATA } from '@angular/material';

// Define Dialog Component
	import style_dialog from "./lab_view_messages.dialog.scss";
	import template_dialog from "./lab_view_messages.dialog.html";

	@Component({
		selector: 'tuxlab-lab-message',
		template: template_dialog,
		styles: [ style_dialog ]
	})
	export class MessageDialog extends MeteorComponent {
    constructor( @Inject(MD_DIALOG_DATA) private data) {
      super();
    }
	}
