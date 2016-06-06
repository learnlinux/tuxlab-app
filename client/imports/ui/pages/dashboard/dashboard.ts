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

  import { InjectUser } from 'angular2-meteor-accounts-ui';

// Angular Material Imports
  import {MeteorComponent} from 'angular2-meteor';


// Define Dashboard Component
@Component({
  selector: 'tuxlab-dashboard',
  templateUrl: '/client/imports/ui/pages/dashboard/dashboard.html',
})

export class Dashboard extends MeteorComponent{

  constructor() {
      super();
  }

}
