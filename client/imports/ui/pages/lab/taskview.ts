// Meteor Imports
  	import { Meteor } from 'meteor/meteor';
  	import { Mongo }  from 'meteor/mongo';
  	import 'reflect-metadata';
  	import 'zone.js/dist/zone';

// Angular Imports
  	import { Component, ViewEncapsulation, provide } from '@angular/core';
  	import { bootstrap } from 'angular2-meteor-auto-bootstrap';

// Angular Material Imports
	import { MeteorComponent } from 'angular2-meteor';

// Terminal and Markdown Imports
  import { Terminal } from "../../components/wetty/terminal";
	import { MarkdownView } from "../../components/markdown/markdown";

// Define TaskView Component
@Component({
  selector: 'tuxlab-taskview',
  templateUrl: '/client/imports/ui/pages/lab/taskview.html',
  directives: [ MarkdownView ]
})

export class TaskView extends MeteorComponent{

  constructor() {
      super();
  }

}
