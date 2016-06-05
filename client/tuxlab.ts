/* TuxLab - TuxLab.ts */


// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';

// Angular Imports
  import { Component, provide } from '@angular/core';
  import { bootstrap } from 'angular2-meteor-auto-bootstrap';

  import { APP_BASE_HREF } from '@angular/common';
  import { RouterLink } from '@angular/router-deprecated';
  import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig } from '@angular/router-deprecated';

  import { InjectUser } from 'angular2-meteor-accounts-ui';

// Angular Material Imports
  import {MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES} from 'ng2-material';
  import {MeteorComponent} from 'angular2-meteor';

  // Toolbar
  import {MdToolbar} from '@angular2-material/toolbar';
  import '../node_modules/@angular2-material/toolbar/toolbar.css'

  // Icon
  import {MdIcon, mdIconRegistry} from '@angular2-material/icon'

@Component({
  selector: 'tuxlab',
  templateUrl: '/client/tuxlab.html',
  directives: [ROUTER_DIRECTIVES,
               MATERIAL_DIRECTIVES,
               MdToolbar,
               MdIcon,
               RouterLink],
  viewProviders: [mdIconRegistry],
})

class TuxLab extends MeteorComponent{
    user: Meteor.User;

    // Setup Icon Font
    constructor(mdIconRegistry: mdIconRegistry) {
      mdIconRegistry.registerFontClassAlias('tux','tuxlabicon');

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
ROUTER_PROVIDERS,
provide(APP_BASE_HREF, { useValue: '/' })]);
