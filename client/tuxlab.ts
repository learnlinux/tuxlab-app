/* TuxLab - TuxLab.ts */

// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';
  import './startup.js';

// Angular Imports
  import { MeteorComponent } from 'angular2-meteor';
  import { Component, ViewEncapsulation, provide, PLATFORM_DIRECTIVES} from '@angular/core';
  import { APP_BASE_HREF, CORE_DIRECTIVES } from '@angular/common';
  import { HTTP_PROVIDERS } from '@angular/http';
  import { bootstrap } from '@angular/platform-browser-dynamic';
  import { InjectUser } from 'angular2-meteor-accounts-ui';

// Angular Material Imports
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
  import { ResponsiveState, RESPONSIVE_DIRECTIVES } from 'responsive-directives-angular2';
  import { disableDeprecatedForms, provideForms } from '@angular/forms';
  import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'
  import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
  import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';

// Routes
  import { ROUTER_DIRECTIVES, RouterConfig, Router } from '@angular/router';
  import { ROUTE_PROVIDERS } from './imports/ui/routes/routes.ts'

// Define TuxLab Component
@Component({
  selector: 'tuxlab',
  templateUrl: '/client/tuxlab.html',
  directives: [ 
    ROUTER_DIRECTIVES,
    MATERIAL_DIRECTIVES,
    MD_TOOLBAR_DIRECTIVES,
    MD_ICON_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES
  ],
  viewProviders: [MdIconRegistry]
})

@InjectUser('user')
class TuxLab extends MeteorComponent {
  user: Meteor.User;
  lastLabId: string;
  lastCourseId: string;

  constructor(mdIconRegistry: MdIconRegistry, private router: Router) {
    super();
    // Create Icon Font
    mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
    mdIconRegistry.setDefaultFontSetClass('tuxicon');
  }

  tuxLogout() {
    Meteor.logout();
    this.router.navigate(['/']);
  }
  
  toLastLab() {
    var self = this;
    Meteor.call('getLastLab', function(err, res) {
      if (err) {
        self.router.navigate(['/']);
      }
      else {
        self.router.navigate(['/course/' + res.courseId + '/labs/' + res.labId]);
      }
    });
  }
}

bootstrap(TuxLab, [
  ResponsiveState,
  disableDeprecatedForms(),
  provideForms(),
  MATERIAL_PROVIDERS,
  HTTP_PROVIDERS,
  MdIconRegistry,
  ROUTE_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' }),
  provide(PLATFORM_DIRECTIVES, { useValue: [RESPONSIVE_DIRECTIVES], multi: true })
]);
