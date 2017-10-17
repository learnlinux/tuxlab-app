// Meteor Imports
	import * as _ from "lodash";
	import { Meteor } from 'meteor/meteor';
	import { Tracker } from 'meteor/tracker';
	import { Component, ViewChild, ElementRef, Input } from '@angular/core';
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
    template: '<div id="tuxlab-terminal" #terminal (window:resize)="onResize($event)"></div>',
    styles: [ style ]
  })

// Export LabView Class
  export default class LabTerminal extends MeteorComponent {
		@ViewChild('terminal') terminal_container : ElementRef;
		private xterm : Terminal;

		@Input('container') container;

    constructor() {
      super();
			XTermStyle;
    }

		onResize(){
			if(!_.isNil(this.xterm)){
				this.xterm.fit();
			}
		}

		public bindSocket(){
			// Get URL
			var host = this.container.container_ip;

			// Create Socket Connection
			var socket = io(host, {
				'path' : '/xterm/socket.io',
				'query' : 'username=' +
									this.container.proxy_username +
									'&password=' +
									this.container.container_pass
			});

			// Open Terminal
			this.xterm = new Terminal();
			this.xterm.open(this.terminal_container.nativeElement, false);
			setTimeout(() => {
				this.xterm.fit();
			}, 1000)

			// Bind to Socket
			socket.on('output', (data) => {
				this.xterm.write(data);
			}).on('disconnect', (err) => {
				console.error(err);
				socket.io.reconnection(false);
			}).on('exception', (err) => {
				console.error(err);
			}).on('error', (err) => {
				console.error(err);
			}).once('data', () => {
				socket.emit('resize', {
					cols : this.xterm.size.cols,
					rows : this.xterm.size.rows
				});
			})

			// Bind to XTerm
			socket.once('connect', () => {

				// Pass Input
				this.xterm.on('data', (data) => {
					socket.emit('input', data);
				});

				// Pass Input
				this.xterm.on('paste', (data) => {
					this.xterm.write('input', data);
				});

				// Resize Listener
				this.xterm.on('resize', (size) => {
					socket.emit('resize', {
						cols : size.cols,
						rows : size.rows
					});
				});
			});

		}

  }
