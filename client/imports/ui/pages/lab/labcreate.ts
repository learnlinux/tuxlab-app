// Meteor Imports
  	import { Meteor } from 'meteor/meteor';
  	import { Mongo }  from 'meteor/mongo';
  	import 'reflect-metadata';
  	import 'zone.js/dist/zone';

// Angular Imports
  	import { Component, Output } from '@angular/core';
  	import { bootstrap } from 'angular2-meteor-auto-bootstrap';
    import { FORM_DIRECTIVES, FORM_PROVIDERS } from '@angular/forms';

// Angular Material Imports
    import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
    import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'
    import { MeteorComponent } from 'angular2-meteor';
    import { FileDropDirective } from 'angular2-file-drop';

// Global Variables Declaration
    declare var Collections: any;

// Define LabCreate Component
@Component({
  selector: 'tuxlab-labcreate',
  templateUrl: '/client/imports/ui/pages/lab/labcreate.html',
  directives: [ FileDropDirective, FORM_DIRECTIVES, MD_ICON_DIRECTIVES, MATERIAL_DIRECTIVES ],
  providers: [ FORM_PROVIDERS, MATERIAL_PROVIDERS ],
  viewProviders: [ MdIconRegistry ]
})

export default class LabCreate extends MeteorComponent {
  public lab : any;
  public uploaded : any;
  public output : any;

  /* CONSTRUCTOR */
  constructor(){
    super();

    this.lab = {};
    this.lab.name = "";
    this.lab.file = "";
    this.uploaded = false;
    this.output = "Compiling...  Errors will display below.";
  }

  /* UPLOAD HANDLER */
  public upload() : void {
    this.uploaded = true;

    Collections.labs.insert({
      "course_id": "1",
      "name": this.lab.name,
      "disabled": false,
      "hidden": false,
      "file": this.lab.file
    }, function(err){
      if(err){
        this.output = this.output + err.toString();
      }
    });
  }

  /* DRAG AND DROP */
  public fileIsOver: boolean = false;
  @Output() public options = {
    readAs: 'Text'
  };

  private file: File;

  public fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  public onFileDrop(up: File): void {
    this.file = up;
  }
}
