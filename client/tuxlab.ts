/* TuxLab - TuxLab.ts */

// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo }       from 'meteor/mongo';
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

  // Toolbar
  import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
  import "../node_modules/@angular2-material/toolbar/toolbar.css";

  // Icon
  import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'

// TuxLab Imports
  import { Dashboard } from "./imports/ui/pages/dashboard/dashboard"
  import { Login } from "./imports/ui/pages/account/login"

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
    { path: '/login', as: 'Login', component: Login },
//  { path: '/course/:courseid', as: 'CourseView', component: CourseView },
//  { path: '/course/:courseid/users', as: 'UserList', component: UserList },
//  { path: '/course/:courseid/user/:userid', as: 'UserView', component: UserView },
//  { path: '/course/:courseid/labs', as: 'LabList', component: LabList },
//  { path: '/course/:courseid/lab/:labid', as: 'LabView', component: LabView },
//  { path: '/account/:userid', as: 'Account', component: Account }
  ])

class TuxLab extends MeteorComponent {
  user: Meteor.User;

  constructor(mdIconRegistry: MdIconRegistry) {
    // Create Icon Font
      mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
      mdIconRegistry.setDefaultFontSetClass('tuxicon');

    super();
  }

}


bootstrap(TuxLab, [
MATERIAL_PROVIDERS,
HTTP_PROVIDERS,
MdIconRegistry,
ROUTER_PROVIDERS,
provide(APP_BASE_HREF, { useValue: '/' })]);
