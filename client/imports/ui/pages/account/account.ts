/* Tuxlab - Tuxlab Account */
// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import {InjectUser} from 'angular2-meteor-accounts-ui';

  import 'reflect-metadata';
  import 'zone.js/dist/zone';

//Template Imports
  import { Template } from 'meteor/templating';
  import './account.html'

// Angular Imports
  import { Component } from '@angular/core';
  

  import { APP_BASE_HREF } from '@angular/common';
  import { HTTP_PROVIDERS } from '@angular/http';

//Router Imports --not used atm


// Angular Material Imports
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MeteorComponent } from 'angular2-meteor';

  // Icon
  import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'
  
  //cards
  import { MD_CARD_DIRECTIVES } from '@angular2-material/card/card';

// Define TuxLab Component
  @Component({
    selector: 'tuxlab-account',
    templateUrl: '/client/imports/ui/pages/account/account.html',
    directives: [ MD_CARD_DIRECTIVES, MD_ICON_DIRECTIVES]
  })

export class Account extends MeteorComponent {
  user: Meteor.User;
  img;
  constructor() {
    super();
    console.log("help");
    Tracker.autorun(() => {
      this.img = 'https://avatars3.githubusercontent.com/u/6845676?v=3&u=eca077840fc0214b4fc7c4636ccc9df7e86c1805&s=140';
    });
  }
}
