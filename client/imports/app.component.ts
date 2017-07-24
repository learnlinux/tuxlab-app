// Angular Component
import { Component, ViewEncapsulation, ViewChild, Renderer2, NgZone  } from "@angular/core";
import { MdSidenav, MdButton } from "@angular/material";
import { ActivatedRoute } from '@angular/router';

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

  constructor(private accountService : AccountService, private render: Renderer2, zone : NgZone){
    this.renderer = render;

    Tracker.autorun(() => {
      zone.run(() => this.user = Meteor.user());
    });
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
