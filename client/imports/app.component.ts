// Angular Component
import { Component, ViewEncapsulation, ViewChild, Renderer2, NgZone  } from "@angular/core";
import { MdSidenav, MdButton } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';

// Meteor
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";

// User Model
import { User } from '../../both/models/user.model';
import AccountService from './account/account.service';

// Template
import template from "./app.component.html";
import style from "./app.component.scss";

@Component({
  selector: "tuxlab",
  template,
  styles: [ style ],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  @ViewChild("sidenav") sidenav: MdSidenav;
  private renderer : Renderer2;
  private user : Meteor.User;

  constructor(private accountService : AccountService, private render: Renderer2, zone : NgZone, private router : Router){
    this.renderer = render;

    // Handle User Updates
    Tracker.autorun(() => {
      zone.run(() => {
        this.user = Meteor.user();
      });
    });

    // Subscribe to User
    Meteor.startup(() => {
      Meteor.subscribe("userData");
    })

    // Handle Password Reset
    Meteor.startup(() => {
      Accounts.onResetPasswordLink((token, done) => {
        this.router.navigate(['/account','reset'], { queryParams : { token : token }});
      })
    })
  }

  ngAfterViewInit(){
    this.checkWindowWidth();
    this.renderer.listen(window, 'resize', (event) => {
      this.checkWindowWidth();
    });
  }

  private checkWindowWidth() : void {
    if(window.innerWidth < 768){
      this.sidenav.close();
    } else{
      this.sidenav.open();
    }
  }
}
