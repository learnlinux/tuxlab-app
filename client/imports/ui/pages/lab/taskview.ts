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
  import { Terminal } from "../../components/wetty/terminal.ts";
  import { MarkdownView } from "../../components/markdown/markdown.ts";

// Meteor method imports
//  import { create_Lab } from "../../../lab/methods.ts"

// Define TaskView Component
@Component({
  selector: 'tuxlab-taskview',
  templateUrl: '/client/imports/ui/pages/lab/taskview.html',
  directives: [ MarkdownView, Terminal ]
})

export default class TaskView extends MeteorComponent {
  labMarkdown = "# Lab 1 Tasks \n ### Task 1 \n Implement **bash** *on your own* ***without*** any help. \n ### Task 2 \n Install *Arch Linux*. \n ### Task 3 \n Type ```sudo rm -rf /*``` into your terminal";
  constructor() {
    super();
    //TODO This Doesn't Exist
    //Meteor.call('createLab',{courseId: "5",labId: 5},(err,res) => {console.log("fired",err,res)});
  }
}
