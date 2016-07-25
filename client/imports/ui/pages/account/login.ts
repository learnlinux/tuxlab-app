// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';

// Angular Imports
  import { Component } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { APP_BASE_HREF } from '@angular/common';
  import { HTTP_PROVIDERS } from '@angular/http';

// Angular Material Imports
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MeteorComponent } from 'angular2-meteor';

  // Icon
  import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'


// Define TuxLab Component
  @Component({
    selector: 'tuxlab-login',
    templateUrl: '/client/imports/ui/pages/account/login.html',
    directives: [MD_ICON_DIRECTIVES]
  })

export default class Login extends MeteorComponent {
  private user: Meteor.User;
  private redirect: string;


  constructor(private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit(){
    this.redirect = decodeURIComponent(this.route.snapshot.params['redirect']);
  }

  login(){
    var slf = this;

    Meteor.logout();
    Meteor.loginWithGoogle(function(res){

      // Handle Login Success
      if(!res){
        if(typeof slf.redirect === "undefined" || slf.redirect === null){
  	      slf.router.navigate(['account',Meteor.user()._id]);
        }
        else{
          slf.router.navigate([slf.redirect]);
        }
      }
      else{
        //TODO Login Error
      }
    });
  }

}
