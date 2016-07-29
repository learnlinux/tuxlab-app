// Meteor Imports
  import { Meteor } from 'meteor/meteor';

// Angular Imports
  import { ViewChild, Component, Input } from '@angular/core';
  import { ROUTER_DIRECTIVES, ActivatedRoute, Router } from '@angular/router';

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

// Meteor method imports
  import "../../../lab/methods.ts"

// Define LabView Component
@Component({
  selector: 'tuxlab-labview',
  templateUrl: '/client/imports/ui/pages/lab/labview.html',
  directives: [
    MarkdownView,
    Terminal,
    MATERIAL_DIRECTIVES,
    MD_INPUT_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES,
    MD_TOOLBAR_DIRECTIVES,
    ROUTER_DIRECTIVES
  ],
  providers: [ OVERLAY_PROVIDERS, MATERIAL_PROVIDERS ],
})

@InjectUser('user')
export default class LabView extends MeteorComponent {
  user: Meteor.User;
  public auth : any;
  labMarkdown: string;
  updateMarkdown: string;
  taskName: string = "Task Name Here";
  labProgress: string = "3 / 10";
  tasks: Array<any> = [];
  currentTask: number;
  currentCompleted: boolean;
  courseId: string;
  nextButton : boolean;
  taskUpdates : Array<string> = [];
  @ViewChild(Terminal) term : Terminal;


  constructor(private route: ActivatedRoute, private router: Router) {
    super();
    this.taskUpdates = [];
    this.nextButton = false;

    document.getElementById('course-content').style.maxWidth = "100%";
  }

  //TODO @cemersoz cleanup
  ngAfterViewInit(){
    var slf = this;
    Meteor.call('prepareLab',"1", function(err,res){
      console.log('here');
      console.log("fired",err,res);
      //slf.labMarkdown = "# Sander \n ## are you sure this will work?";
      slf.tasks = res.taskList;
      slf.toTask(slf.tasks[0]);
      slf.labProgress = "0 / "+slf.tasks.length;
      slf.auth = {
        username: Meteor.user().profile.nickname,
        password: res.sshInfo.pass,
        domain: "10.100.1.11"
      };
      slf.taskUpdates = res.taskUpdates;

      slf.term.openTerminal(slf.auth);
      console.log("fired",err,res);
    });
  }

  // Called by Check button
  verify(){
    Meteor.call('verifyTask',"1",function(err,res){
      var slf = this;
      if(err){
        console.log("something went horribly wrong");
      }
      else{
        if(res.verified){
          slf.nextButton = true;
        }
        else{
          slf.nextButton = false;
        }
        slf.taskUpdates = res.taskUpdates;
      }
    });
  }

  // Called by Next button
  nextTask(){
    console.log("proceeding");
    var slf = this;
      Meteor.call('nextTask',"1",function(err,res){
        if(err){
          slf.nextButton = false;
          console.log("try again");
        }
        else{
          console.log(res);
          slf.tasks = res.taskList
          slf.toTask(slf.tasks[res.taskNo-1]);
          slf.labProgress = res.taskNo+" / "+slf.tasks.length
          slf.taskUpdates = res.taskUpdates
        }
      });
  }
  toTask(task) {
    this.labMarkdown = task.md;
    this.updateMarkdown = task.update;
    this.currentTask = task.id;
    this.currentCompleted = task.completed;
  }

  // Check and join tasks and taskupdates
  joinTaskUpdate() {
    if(this.tasks.length === this.taskUpdates.length) {
      for(let i = 0; i < this.tasks.length; i++) {
        this.tasks[i].update = this.taskUpdates[i];
      }
    }
    else {
      throw new Error("Tasks to not match task updates");
    }
  }

  ngOnInit() {
    this.courseId = this.router.routerState.parent(this.route).snapshot.params['courseid'];
  }

}
