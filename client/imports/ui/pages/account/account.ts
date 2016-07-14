// Meteor Imports
    import { Meteor } from 'meteor/meteor';
    import { Mongo }       from 'meteor/mongo';
    import 'reflect-metadata';
    import 'zone.js/dist/zone';

// Angular Imports
    import { Component, ViewEncapsulation, provide } from '@angular/core';
    import { bootstrap } from 'angular2-meteor-auto-bootstrap';

    import { APP_BASE_HREF, FORM_DIRECTIVES } from '@angular/common';
    import { HTTP_PROVIDERS } from '@angular/http';

    import { InjectUser } from 'angular2-meteor-accounts-ui';

// Angular Material Imports
    import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
    import { MeteorComponent } from 'angular2-meteor';
    import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
    import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';

// Toolbar
    import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';

// Icon
    import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'

// Define Account Component
@Component({
  selector: 'tuxlab-account',
  templateUrl: '/client/imports/ui/pages/account/account.html',
  directives: [
    MATERIAL_DIRECTIVES,
    MD_TOOLBAR_DIRECTIVES,
    MD_ICON_DIRECTIVES,
    MD_INPUT_DIRECTIVES,
    FORM_DIRECTIVES
  ],
  viewProviders: [ MdIconRegistry ],
  encapsulation: ViewEncapsulation.None
})

// Accounts Class
@InjectUser('user')
export default class Account extends MeteorComponent {
  user: Meteor.User;


  constructor(mdIconRegistry: MdIconRegistry) {
    super();

    // Create Icon Font
    mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
    mdIconRegistry.setDefaultFontSetClass('tuxicon');

  }
}
