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
    labs: Array<Object> = [];
    courseRecord: any;
    cur_user: boolean;

    // Progress Bar Value
    public determinateValue: number = 0;

    constructor(private route: ActivatedRoute, private router: Router) {
      super();
    }

    getCourseRecords() {
      // Get from course_records
      this.subscribe('course-records', () => {
        this.autorun(() => {
          if(this.cur_user) {
            // Student
            this.courseRecord = Collections.course_records.findOne({ course_id: this.courseId, user_id: Meteor.userId() });
          }
          else {
            var localCourseRecord = Collections.course_records.findOne({ course_id: this.courseId, user_id: this.userId });
            if(localCourseRecord === null || typeof localCourseRecord === "undefined") {
              // Admin
              this.courseRecord = Meteor.call('getUserCourseRecord', this.courseId, this.userId);
            }
            else {
              // Instructor
              this.courseRecord = localCourseRecord;
            }
          }
          this.setLabs();
        });
      }, true);
      // Get rest of courses from courses database
      this.subscribe('explore-courses', () => {
        this.autorun(() => {
          var labids: Array<string> = Collections.courses.findOne({ _id: this.courseId }).labs;
        });
      }, true);
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
          this.labs.push({
            'id': lab._id,
            'name': 'Lab ' + (i + 1).toString(),
            'completed': tasksCompleted.toString() + '/' + tasks.length.toString(),
            'date': 'soon'
          });
          totalCompleted += tasksCompleted;
          totalNumTasks += tasks.length;
        }
        this.determinateValue = (totalCompleted * 100.0) / totalNumTasks;
      }
    }

    ngOnInit(){
      this.userId = this.router.routerState.parent(this.route).snapshot.params['userid'];
      this.courseId = this.router.routerState.parent(this.route).snapshot.params['courseid'];
      this.cur_user = (typeof this.userId === "undefined" || this.userId === null);
      this.getCourseRecords();
    }

  }
