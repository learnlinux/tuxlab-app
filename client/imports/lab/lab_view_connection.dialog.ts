// Imports
	import { MeteorComponent } from 'angular2-meteor';
	import { Component } from '@angular/core';

// Define Dialog Component
	import style_dialog from "./lab_view_connection.dialog.scss";
	import template_dialog from "./lab_view_connection.dialog.html";

// Collections
	import { Container } from '../../../both/models/session.model';

  //  ConnectionDialog Class
	@Component({
		selector: 'tuxlab-lab-connection-details',
		template: template_dialog,
		styles: [ style_dialog ]
	})
	export class ConnectionDetailsDialog extends MeteorComponent {
		public container : Container;
	}
