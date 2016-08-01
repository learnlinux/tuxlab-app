// Meteor Imports
  import { Meteor } from 'meteor/meteor';

// Angular Imports
  import { Component } from '@angular/core';
  import { InjectUser } from 'angular2-meteor-accounts-ui';
  import { ROUTER_DIRECTIVES, ActivatedRoute, Router, RouterState } from '@angular/router';

// Angular Material Imports
  import { MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MeteorComponent } from 'angular2-meteor';
  import { OVERLAY_PROVIDERS } from '@angular2-material/core/overlay/overlay';
  import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';

  import { FORM_DIRECTIVES } from '@angular/common';
  import { MdToolbar } from '@angular2-material/toolbar';

// LabList and Grades import
  import { GradeList } from './gradelist.ts';
  import { LabList } from './lablist.ts';

// Roles Import
  import { Roles } from '../../../../../collections/users.ts';

// Markdown Editor
  import { MDEditor } from '../../components/mdeditor/mdeditor.ts';

// Icon
  import { MD_ICON_DIRECTIVES } from '@angular2-material/icon';

declare var Collections: any;

/// <reference path="../../../ui/components/markdown/marked.d.ts" />
  import * as marked from 'marked';

// Define CourseDashboard Component
  @Component({
    selector: 'tuxlab-course-dashboard',
    templateUrl: '/client/imports/ui/pages/course/course_dashboard.html',
    directives: [
      ROUTER_DIRECTIVES,
      MATERIAL_DIRECTIVES,
      MD_INPUT_DIRECTIVES,
      MD_ICON_DIRECTIVES,
      FORM_DIRECTIVES,
      MdToolbar,
      LabList,
      MDEditor,
      GradeList
    ],
    providers: [OVERLAY_PROVIDERS]
  })

// Export CourseDashboard Class
  export class CourseDashboard extends MeteorComponent {
    course;
    courseId: string;
    courseDescription: string = "";
    courseName: string = "";
    courseSyllabus: string = "";
    editSyllabus: boolean = false;
    radioMeta: boolean;
    radioContent: string;
    radioEnroll: string;
    updateMessage: string = "";

    constructor(private route: ActivatedRoute, private router: Router) {
      super();

      // Subscribe to courses database and set current course
      this.subscribe('user-courses', this.courseId, () => {
        this.autorun(() => {
          this.course = Collections.courses.findOne({ _id: this.courseId });
          if (typeof this.course !== "undefined") {
            this.courseName = this.course.course_name;
            this.courseDescription = this.course.course_description.content;
            this.courseSyllabus = this.course.course_description.syllabus;
            this.radioMeta = this.course.permissions.meta;
            this.radioContent = this.course.permissions.content;
            this.radioEnroll = this.course.permissions.enroll;
          }
        });
      }, true);
    }
    ngOnInit() {
      this.courseId = this.router.routerState.parent(this.route).snapshot.params['courseid'];
    }
    isInstruct() {
      if (typeof this.courseId !== "undefined") {
        return Roles.isInstructorFor(this.courseId);
      }
      else {
        return false;
      }
    }

    // Emit function
    mdUpdate(md: string) {
      this.courseSyllabus = md;
    }

    // Update the database with new syllabus
    updateSyllabus() {
      Collections.courses.update({
        _id: this.courseId
      }, {
        $set: {
          "course_description.syllabus": this.courseSyllabus
        }
      });
      this.toggleEdit();
    }

    updatePerm() {
      if(typeof this.radioMeta !== "undefined" && typeof this.radioContent !== "undefind" && typeof this.radioMeta !== "undefined") {
        Collections.courses.update({
          _id: this.courseId
        }, {
          $set: {
            permissions: {
              meta: this.radioMeta,
              content: this.radioContent,
              enroll: this.radioEnroll
            }
          }
        });
        this.updateMessage = "Last updated on " + (new Date()).toLocaleTimeString();
      }
      else {
        this.updateMessage = "Error updating: one or more fields are not selected";
      }
    }

    // Hide and show the markdown editor for syllabus
    toggleEdit() {
      this.editSyllabus = !this.editSyllabus;
    }

    // Convert to markdown
    convert(markdown: string) {
      let md = marked.setOptions({});
      if(typeof markdown !== "undefined" && markdown !== null) {
        return md.parse(markdown);
      }
      else {
        return "";
      }
    }
  }
