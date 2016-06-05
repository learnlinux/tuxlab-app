/* TuxLab - TuxLab.ts */


// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';

// Angular Imports
  import { Component, ViewEncapsulation, provide } from '@angular/core';
  import { bootstrap } from 'angular2-meteor-auto-bootstrap';

  import { APP_BASE_HREF } from '@angular/common';
  import { RouterLink } from '@angular/router-deprecated';
  import { HTTP_PROVIDERS } from '@angular/http';
  import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig } from '@angular/router-deprecated';

  import { InjectUser } from 'angular2-meteor-accounts-ui';

// Angular Material Imports
  import {MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES} from 'ng2-material';
  import {MeteorComponent} from 'angular2-meteor';

  // Button
  import {MD_BUTTON_DIRECTIVES} from '@angular2-material/button';

  // Toolbar
  import {MD_TOOLBAR_DIRECTIVES} from '@angular2-material/toolbar';
  import "../node_modules/@angular2-material/toolbar/toolbar.css";

  // Icon
  import {MD_ICON_DIRECTIVES, MdIconRegistry} from '@angular2-material/icon'

// Define TuxLab Component
  @Component({
    selector: 'tuxlab',
    templateUrl: '/client/tuxlab.html',
    directives: [ROUTER_DIRECTIVES,
                 MATERIAL_DIRECTIVES,
                 MD_TOOLBAR_DIRECTIVES,
                 MD_ICON_DIRECTIVES,
                 RouterLink],
    viewProviders: [MdIconRegistry],
    encapsulation: ViewEncapsulation.None,
  })

// Define TuxLab Routes
  @RouteConfig([
    { path: '/', as: 'Dashboard', component: Dashboard },
    { path: '/account/:userid', as: 'AccountView', component: AccountView }
  ])

class TuxLab extends MeteorComponent {
  user: Meteor.User;

  constructor(mdIconRegistry: MdIconRegistry) {

    // Create Icon Font
      mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
      mdIconRegistry.setDefaultFontSetClass('tuxicon');

    super();
  }

  logout() {
    this.autorun(() => {
      Meteor.logout();
    });
  }
}


bootstrap(TuxLab, [
MATERIAL_PROVIDERS,
HTTP_PROVIDERS,
MdIconRegistry,
ROUTER_PROVIDERS,
provide(APP_BASE_HREF, { useValue: '/' })]);
