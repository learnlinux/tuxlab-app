// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { MeteorComponent } from 'angular2-meteor';


// Angular Imports
  import { Component, Input } from '@angular/core';
  import { InjectUser } from 'angular2-meteor-accounts-ui';
  import { ActivatedRoute, Router } from '@angular/router';

// Angular Material Imports
  import { MATERIAL_DIRECTIVES } from 'ng2-material';

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
      MDEditor
    ],
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
