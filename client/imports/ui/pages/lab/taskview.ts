// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo }  from 'meteor/mongo';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';

// Angular Imports
  import { ViewChild, Component, ViewEncapsulation, provide } from '@angular/core';
  import { bootstrap } from 'angular2-meteor-auto-bootstrap';

// Angular Material Imports
  import { MeteorComponent } from 'angular2-meteor';
  import { OVERLAY_PROVIDERS } from '@angular2-material/core/overlay/overlay';
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';

  import { InjectUser } from 'angular2-meteor-accounts-ui';

// Terminal and Markdown Imports
  import { Terminal } from "../../components/wetty/terminal.ts";
  import { MarkdownView } from "../../components/markdown/markdown.ts";
  
// Icons
  import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// Meteor method imports
  import "../../../lab/methods.ts"
// Define TaskView Component

@Component({
  selector: 'tuxlab-taskview',
  templateUrl: '/client/imports/ui/pages/lab/taskview.html',
  directives: [ 
    MarkdownView, 
    Terminal,
    MD_ICON_DIRECTIVES,
    MATERIAL_DIRECTIVES
  ],
  viewProviders: [ MdIconRegistry ],
  providers: [ OVERLAY_PROVIDERS, MATERIAL_PROVIDERS ],
  encapsulation: ViewEncapsulation.None
})

@InjectUser('user')
export default class TaskView extends MeteorComponent {
  user: Meteor.User;
  public auth : any;

  @ViewChild(Terminal) term : Terminal;
  
  labMarkdown = "# Lab 1 Tasks \n ### Task 1 \n Implement **bash** *on your own* ***without*** any help. \n ### Task 2 \n Install *Arch Linux*. \n ### Task 3 \n Type ```sudo rm -rf /*``` into your terminal";

  constructor() {
    super();
  }

  ngAfterViewInit(){  
    var slf = this;
    Meteor.call('prepareLab',"1","1", function(err,res){
      slf.labMarkdown = "#Sander \n ##are you sure this will work?";
      console.log(slf.labMarkdown);
      slf.auth = {
        username: Meteor.user().profile.nickname,
        password: res.sshInfo.pass,
        domain: "10.100.1.11"
      };
      slf.term.openTerminal(slf.auth);
      console.log("fired",err,res);
    });
  }
}