// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { Tracker } from 'meteor/tracker';
	import { Component, ViewChild, ElementRef } from '@angular/core';
	import { MeteorComponent } from 'angular2-meteor';

// Import Socket.IO
	import * as io from "socket.io-client";

// Import Xterm
  import * as Terminal from 'xterm/dist/xterm';
	import 'xterm/dist/addons/fit/fit.js';
	import XTermStyle from 'xterm/dist/xterm.css';

// Define Lab View Component
  import style from "./lab_terminal.component.scss";

// Export Data Interface
  @Component({
    selector: 'tuxlab-terminal',
    template: '<div id="tuxlab-terminal" #terminal></div>',
    styles: [ style ]
  })

// Export LabView Class
  export default class LabTerminal extends MeteorComponent {
		@ViewChild('terminal') container : ElementRef;
		private xterm : Terminal;

    constructor() {
      super();
			XTermStyle;
    }

		ngOnInit(){
			this.xterm = new Terminal();
			this.xterm.open(this.container.nativeElement);
			this.xterm.fit();
		}
  }
