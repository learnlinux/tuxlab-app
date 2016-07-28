// Meteor Imports
  	import { Meteor } from 'meteor/meteor';

// Angular Imports
  	import { Component, Output } from '@angular/core';
    import { FORM_DIRECTIVES, FORM_PROVIDERS } from '@angular/forms';
    import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular Material Imports
    import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
    import { MeteorComponent } from 'angular2-meteor';
    import { FileDropDirective } from 'angular2-file-drop';

// Global Variables Declaration
    declare var Collections: any;

// Define LabCreate Component
@Component({
  selector: 'tuxlab-labcreate',
  templateUrl: '/client/imports/ui/pages/lab/labcreate.html',
  directives: [ FileDropDirective,
<<<<<<< HEAD
                ROUTER_DIRECTIVES,
=======
>>>>>>> 2552d21e3df4aa53fdb6718215740f39acfb00a4
                FORM_DIRECTIVES,
                MATERIAL_DIRECTIVES
  ],
  providers: [
    FORM_PROVIDERS,
    MATERIAL_PROVIDERS
  ],
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
