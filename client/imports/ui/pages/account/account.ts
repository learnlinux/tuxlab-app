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
    import { RouterLink, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig } from '@angular/router-deprecated';

    import { InjectUser, RequireUser } from 'angular2-meteor-accounts-ui';

// Angular Material Imports
    import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
    import { MeteorComponent } from 'angular2-meteor';

// Icon
    import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'


// Icon
    import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'

// Define Account Component
@Component({
    selector: 'tuxlab-account',
    templateUrl: '/client/imports/ui/pages/account/account.html',
    directives: [ MD_ICON_DIRECTIVES,
                  MATERIAL_DIRECTIVES ],
    viewProviders: [ MdIconRegistry ],
    encapsulation: ViewEncapsulation.None
  })
  
@InjectUser("user")
export class Account extends MeteorComponent {
  user: Meteor.User;
  name: String = "Name Here";
  school: String = "School Here";
  email: String = "example@example.com";
  imgsrc: String = "http://www.placekitten.com/g/250/250";
  constructor(mdIconRegistry: MdIconRegistry) {
    super();
    // Create Icon Font
    mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
    mdIconRegistry.setDefaultFontSetClass('tuxicon');
    
  }
  test() {
    this.name = this.user.profile.name;
    this.school = "Carnegie Mellon University";
    this.imgsrc = this.user.profile.picture;
    this.email = this.user.profile.email;
  }
}
