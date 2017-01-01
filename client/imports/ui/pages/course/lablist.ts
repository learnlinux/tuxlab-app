// Meteor Imports
  import { Meteor } from 'meteor/meteor';

// Angular Imports
  import { Component } from '@angular/core';
  import { ROUTER_DIRECTIVES, ActivatedRoute, Router} from '@angular/router';

// Angular Material Imports
  import { MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS } from 'ng2-material';
  import { MdProgressBar } from '@angular2-material/progress-bar';
  import { OVERLAY_PROVIDERS } from '@angular2-material/core/overlay/overlay';

// Angular Meteor Imports
  import { MeteorComponent } from 'angular2-meteor';
  import { InjectUser } from 'angular2-meteor-accounts-ui';

// Roles
  import { Roles } from '../../../../../collections/users';

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
    providers: [ MATERIAL_PROVIDERS, OVERLAY_PROVIDERS ]
  })

  export class LabList extends MeteorComponent {
    user: Meteor.User;
    courseId: string;
    userId: string = Meteor.userId();
    courseRecord: any;
    exportData: string = "";

    // Test
    allLabs: Array<Object>;
    partialLabs: Array<Object>;

    // Progress Bar Value
    public determinateValue: number = 0;

    constructor(private route: ActivatedRoute, private router: Router) {
      super();

      // Get labs in course_records
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

    getLabs() {
      var finalLabs = []; // Return this, an array of formatted labs
      if(typeof this.partialLabs !== "undefined" && typeof this.allLabs !== "undefined") {
        // All labs from course database
        finalLabs = this.allLabs;
        // Get Lab Ids and compare with partial labs from course_records
        var finalLabIds = _.map(finalLabs, function(lb) { return lb._id; });
        for(let i = 0; i < finalLabIds.length; i++) {
          let currentLabId = finalLabIds[i];
          let numTasks = finalLabs[i].tasks.length;
          // Set default completed in case it is not in course_records
          finalLabs[i].completed = "0/" + numTasks;
          for(let j = 0; j < this.partialLabs.length; j++) {
            if((<any>(this.partialLabs[j]))._id.str === currentLabId.str) {
              finalLabs[i].completed = this.compTasks(this.partialLabs[j]) + "/" + numTasks;
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

    isInstruct() {
      if(typeof this.courseId !== "undefined") {
        return Roles.isInstructorFor(this.courseId);
      }
      else {
        return false;
      }
    }
    exportLab(lab_id) {
      var self = this;
      Meteor.call('exportLab', lab_id, function(err, res) {
        if(err) {
          self.exportData = "Error getting data";
        }
        else {
          self.exportData = res;
        }
      });
    }
  }
