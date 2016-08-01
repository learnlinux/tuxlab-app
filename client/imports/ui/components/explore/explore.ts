// Meteor Imports
  import { Meteor } from 'meteor/meteor';

// Angular Imports
  import { Component } from '@angular/core';
  import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular Material Imports
  import { MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MeteorComponent } from 'angular2-meteor';
  import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';

// Collections
  declare var Collections: any;

/// <reference path="../markdown/marked.d.ts" />
  import * as marked from 'marked';

// Define ExploreView Component
  @Component({
    selector: 'tuxlab-exploreview',
    templateUrl: '/client/imports/ui/components/explore/explore.html',
    directives: [
      MATERIAL_DIRECTIVES,
      ROUTER_DIRECTIVES,
      MD_TABS_DIRECTIVES
    ],
  })

// Export ExploreView Class
export class ExploreView extends MeteorComponent {

  exploreCourses: Array<any> = [];

  constructor() {
    super();

    this.subscribe('explore-courses', () => {
      this.exploreCourses = Collections.courses.find({ "featured": true }).fetch();
    }, true);
  }

  // Convert to markdown
  convert(markdown: string) {
    let md = marked.setOptions({});
    if(typeof markdown !== "undefined" && markdown !== null) {
      return md.parse(markdown);
    }
    else {
      return "";
    }
  }
}
