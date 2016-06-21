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
  import { HTTP_PROVIDERS } from '@angular/http';
  import { ROUTER_DIRECTIVES, provideRouter, RouterConfig } from '@angular/router';

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
  import { Account } from "./imports/ui/pages/account/account"
  import { Err404 } from "./imports/ui/pages/error/404"
  import { TaskView } from "./imports/ui/pages/lab/taskview";
  import { CourseView } from "./imports/ui/pages/courseview/courseview";
  import { LabView } from "./imports/ui/pages/courseview/labview";
  import { GradeView } from "./imports/ui/pages/courseview/gradeview";
  import { Explore } from "./imports/ui/pages/explore/explore"; 

// Define TuxLab Component
  @Component({
    selector: 'tuxlab',
    templateUrl: '/client/tuxlab.html',
    directives: [ROUTER_DIRECTIVES,
                 MATERIAL_DIRECTIVES,
                 MD_TOOLBAR_DIRECTIVES,
                 MD_ICON_DIRECTIVES],
    viewProviders: [MdIconRegistry],
    encapsulation: ViewEncapsulation.None,
  })

// Define TuxLab Routes
export const routes : RouterConfig =([
    { path: '/', component: Dashboard },
    { path: '/login', component: Login },
    { path: '/404', component: Err404 },
    { path: '/', component: Dashboard },
    { path: '/login', component: Login },
    { path: '/lab', component: TaskView },
    { path: '/course', component: CourseView },
    { path: '/labs', component: LabView },
    { path: 'grades', component: GradeView },
    { path: '/explore', component: Explore },
//  { path: '/course/:courseid', as: 'CourseView', component: CourseView },
//  { path: '/course/:courseid/users', as: 'UserList', component: UserList },
//  { path: '/course/:courseid/user/:userid', as: 'UserView', component: UserView },
//  { path: '/course/:courseid/labs', as: 'LabList', component: LabList },
//  { path: '/course/:courseid/lab/:labid', as: 'LabView', component: LabView },
    { path: '/account/:userid', component: Account },
    { path: '/**', component: Err404 }
]);

export const TUXLAB_ROUTER_PROVIDERS = [
	  provideRouter(routes)
];

class TuxLab extends MeteorComponent {
  user: Meteor.User;
  courseName = "GPI" + " Home";
  constructor(mdIconRegistry: MdIconRegistry) {
    super();
    // Create Icon Font
      mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
      mdIconRegistry.setDefaultFontSetClass('tuxicon');
  }
}

bootstrap(TuxLab, [
MATERIAL_PROVIDERS,
TUXLAB_ROUTER_PROVIDERS,
HTTP_PROVIDERS,
MdIconRegistry,
provide(APP_BASE_HREF, { useValue: '/' })]);
