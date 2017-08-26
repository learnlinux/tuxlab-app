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

// Client Console Model
import { ConsoleOutput, ConsoleOutputType } from '../../both/models/console_output.model';

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

    // Enable Console Forwarding
    Meteor.startup(() => {

      // Create Console Collection
      var consoleCollection = new Mongo.Collection<ConsoleOutput>('_console');
      consoleCollection.find().observe({
        added : function(doc : ConsoleOutput){

          doc.args = JSON.parse(doc.args);

          switch(doc.type){
            case ConsoleOutputType.info:
              console.info("Lab Runtime (" + doc.createdAt.toUTCString() + "):");
              console.info.apply(console, doc.args);
              break;
            case ConsoleOutputType.log:
              console.log("Lab Runtime (" + doc.createdAt.toUTCString() + "):");
              console.log.apply(console, doc.args);
              break;
            case ConsoleOutputType.warn:
              console.warn("Lab Runtime (" + doc.createdAt.toUTCString() + "):");
              console.warn.apply(console, doc.args);
              break;
            case ConsoleOutputType.error:
              console.error("Lab Runtime (" + doc.createdAt.toUTCString() + "):");
              console.error.apply(console, doc.args);
              break;
          }
        }
      });

      // Subscribe to Console Collection
      Meteor.subscribe('_console');

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
