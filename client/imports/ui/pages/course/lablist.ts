// Meteor Imports
  import { Meteor } from 'meteor/meteor';

// Angular Imports
  import { Component } from '@angular/core';
  import { ROUTER_DIRECTIVES, ActivatedRoute, Router} from '@angular/router';

// Angular Material Imports
  import { MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS } from 'ng2-material';
  import { MdProgressBar } from '@angular2-material/progress-bar';

// Angular Meteor Imports
  import { MeteorComponent } from 'angular2-meteor';
  import { InjectUser } from 'angular2-meteor-accounts-ui';

// Declare Collections
  declare var Collections: any;
  declare var _: any;

// Inject current user into class
  @InjectUser("user")

// Define LabList Component
  @Component({
    selector: 'tuxlab-lablist',
    templateUrl: '/client/imports/ui/pages/course/lablist.html',
    directives: [
      MdProgressBar,
      ROUTER_DIRECTIVES,
      MATERIAL_DIRECTIVES
    ],
    providers: [ MATERIAL_PROVIDERS ]
  })

  export class LabList extends MeteorComponent {
    user: Meteor.User;
    courseId: string;
    userId: string = Meteor.userId();
    courseRecord: any;

    // Test
    allLabs: Array<Object>;
    partialLabs: Array<Object>;

    // Progress Bar Value
    public determinateValue: number = 0;

    constructor(private route: ActivatedRoute, private router: Router) {
      super();

    getCourseRecords() {
      // Get from course_records
      this.subscribe('course-records', () => {
        this.autorun(() => {
          var record = Collections.course_records.findOne({ course_id: this.courseId });
          this.partialLabs = record.labs;
        }, true);
      });
      
      // Get all labs of this course
      this.subscribe('labs', () => {
        this.autorun(() => {
          this.allLabs = Collections.labs.find({ course_id: this.courseId }).fetch();
        }, true);
      });
    }

    setLabs() {
      if(typeof this.courseRecord !== "undefined" && this.courseRecord !== null) {
        let labs = this.courseRecord.labs;
        let totalCompleted = 0;
        let totalNumTasks = 0;
        for (let i = 0; i < labs.length; i++) {
          let lab = labs[i];
          let tasksCompleted = 0;
          let tasks = lab.tasks;
          for (let j = 0; j < tasks.length; j++) {
            let task = tasks[j];
            if (task.status === 'COMPLETED') {
                tasksCompleted++;
            }
          }
        }
      }
      return finalLabs;
    }

    compTasks(lab) {
      let comp = 0;
      for(let i = 0; i < lab.tasks.length; i++) {
        if(lab.tasks[i].status === "COMPLETED") {
          comp++;
        }
      }
      return comp;
    }

    ngOnInit(){
      this.userId = this.router.routerState.parent(this.route).snapshot.params['userid'];
      this.courseId = this.router.routerState.parent(this.route).snapshot.params['courseid'];
    }

  }
