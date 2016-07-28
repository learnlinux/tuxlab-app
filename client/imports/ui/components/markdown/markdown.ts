// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';

// Angular Imports
  import { Component, ViewEncapsulation, provide, Input, OnInit } from '@angular/core';
  import { bootstrap } from 'angular2-meteor-auto-bootstrap';
  import { APP_BASE_HREF } from '@angular/common';
  import { HTTP_PROVIDERS } from '@angular/http';
  import { InjectUser } from 'angular2-meteor-accounts-ui';
  import { ActivatedRoute, Router } from '@angular/router';

// Angular Material Imports
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MeteorComponent } from 'angular2-meteor';
  import { OVERLAY_PROVIDERS } from '@angular2-material/core/overlay/overlay';
  import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
  import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';

// Toolbar
  import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';

// Icon
  import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';
  
// MDEditor
  import { MDEditor } from '../mdeditor/mdeditor.ts';
  
// Roles
  import { Roles } from '../../../../../collections/users.ts';
  
declare var Collections: any;

// Markdown Imports
/// <reference path="./marked.d.ts" />
  import * as marked from 'marked';

// Define Markdown Component
  @Component({
    selector: 'tuxlab-markdown',
    templateUrl: '/client/imports/ui/components/markdown/markdown.html',
    directives: [
      MATERIAL_DIRECTIVES,
      MD_TOOLBAR_DIRECTIVES,
      MD_ICON_DIRECTIVES,
      MD_INPUT_DIRECTIVES,
      MD_SIDENAV_DIRECTIVES,
      MDEditor
    ],

    viewProviders: [ MdIconRegistry ],
    providers: [ OVERLAY_PROVIDERS ],
    encapsulation: ViewEncapsulation.None
  })

// Export MarkdownView Class
export class MarkdownView extends MeteorComponent{
  @Input() mdData = "";
  @Input() mdDataUpdate = "";
  courseId: string;
  labId: string;
  showMDE: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    super();

  }
  convert(markdown: string) {
    let md = marked.setOptions({});
    if(typeof markdown !== "undefined" && markdown !== null) {
      return md.parse(markdown);
    }
    else {
      return "";
    }
  }
  ngOnInit() {
    this.courseId = this.router.routerState.parent(this.route).snapshot.params['courseid'];
    this.labId = this.route.snapshot.params['labid'];
  }
  isInstruct() {
    if(typeof this.courseId !== "undefined") {
      return Roles.isInstructorFor(this.courseId);
    }
    else {
      return false;
    }
  }
  // Toggle to show either markdown editor or task markdown
  mdeToggle() {
    this.showMDE = !this.showMDE;
  }
  
  // Update new markdown 
  updateMarkdown() {
    Collections.labs.update({ 
      _id: this.labId 
    }, { 
      $set: {
        // Set current task markdown 
      } 
    });
  }
  // Output event from MDE 
  mdUpdated(md: string) {
    this.mdData = md;
  }
}