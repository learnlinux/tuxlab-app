// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo }  from 'meteor/mongo';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';

// Angular Imports
  import { ViewChild, Component, ViewEncapsulation, provide, Input } from '@angular/core';
  import { bootstrap } from 'angular2-meteor-auto-bootstrap';
  import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular Material Imports
  import { MeteorComponent } from 'angular2-meteor';
  import { OVERLAY_PROVIDERS } from '@angular2-material/core/overlay/overlay';
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
  import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
  import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
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
    MATERIAL_DIRECTIVES,
    MD_INPUT_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES,
    MD_TOOLBAR_DIRECTIVES,
    ROUTER_DIRECTIVES
  ],
  viewProviders: [ MdIconRegistry ],
  providers: [ OVERLAY_PROVIDERS, MATERIAL_PROVIDERS ],
  encapsulation: ViewEncapsulation.None
})

@InjectUser('user')
export default class TaskView extends MeteorComponent {
  user: Meteor.User;
  public auth : any;
  labMarkdown: string;
  taskName: string = "Task Name Here";
  labProgress: string = "3 / 10";
  tasks: Array<any>;
  currentTask: number;
  courseId: string;
  @ViewChild(Terminal) term : Terminal;

  constructor() {
    super();
    this.tasks = [
      { id: 1, name: "Task 1", completed: true, md: "# Task 1" },
      { id: 2, name: "Task 2", completed: true, md: "# Task 2" },
      { id: 3, name: "Task 3", completed: true, md: "# Task 3" },
      { id: 4, name: "Task 4", completed: false, md: "# Task 4" },
      { id: 5, name: "Task 5", completed: true, md: "# Task 5" },
      { id: 6, name: "Task 6", completed: false, md: "# Task 6" },
    ];
  }

  ngAfterViewInit(){  
    var slf = this;
    Meteor.call('prepareLab',"1","1", function(err,res){
      slf.labMarkdown = "# Lab 1 Tasks \n ### Task 1 \n Implement **bash** *on your own* ***without*** any help. \n ### Task 2 \n Install *Arch Linux*. \n ### Task 3 \n Type ```sudo rm -rf /*``` into your terminal";
      slf.auth = {
        username: Meteor.user().profile.nickname,
        password: res.sshInfo.pass,
        domain: "10.100.1.11"
      };
      slf.term.openTerminal(slf.auth);
      console.log("fired",err,res);
    });
  }
  
  toTask(task) {
    this.labMarkdown = task.md;
    this.currentTask = task.id;
  }
  
}
