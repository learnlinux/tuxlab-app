// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';

// Angular Imports
  import { Component, ViewEncapsulation, provide, Input } from '@angular/core';
  import { bootstrap } from 'angular2-meteor-auto-bootstrap';
  import { APP_BASE_HREF } from '@angular/common';
  import { HTTP_PROVIDERS } from '@angular/http';
  import { InjectUser } from 'angular2-meteor-accounts-ui';

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
      MD_SIDENAV_DIRECTIVES
    ],

    viewProviders: [ MdIconRegistry ],
    providers: [ OVERLAY_PROVIDERS ],
    encapsulation: ViewEncapsulation.None
  })

// Export MarkdownView Class
export class MarkdownView extends MeteorComponent{
  @Input() mdData = "";
  @Input() mdDataUpdate = "";

  constructor(mdIconRegistry: MdIconRegistry) {
    super();
    // Create Icon Font
    mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
    mdIconRegistry.setDefaultFontSetClass('tuxicon');

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
}
