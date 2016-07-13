// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';
	
// Angular Imports 
  import { Component, ViewEncapsulation, provide } from '@angular/core';
  import { bootstrap } from 'angular2-meteor-auto-bootstrap';
  import { APP_BASE_HREF } from '@angular/common';
  import { HTTP_PROVIDERS } from '@angular/http';
  import { InjectUser } from 'angular2-meteor-accounts-ui';
    
// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MeteorComponent } from 'angular2-meteor';
	
// Icon
  import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';
		
// Course Records Import
  import { course_records } from '../../../../../collections/course_records';

// Define UserList Component
  @Component({
    selector: 'tuxlab-userlist',
    templateUrl: '/client/imports/ui/components/userlist/userlist.html',
    directives: [
      MATERIAL_DIRECTIVES,
      MD_ICON_DIRECTIVES],
    viewProviders: [ MdIconRegistry ],
    encapsulation: ViewEncapsulation.None
  })

// Export UserList Class 
  export class UserList extends MeteorComponent {
    user: Meteor.User;
    courseId: String;
    userIds: Array<String>;
    constructor(mdIconRegistry: MdIconRegistry) {
      super();
      // Create Icon Font
      mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
      mdIconRegistry.setDefaultFontSetClass('tuxicon');

      this.subscribe('course-records', this.courseId, () => {
        let courseRecords = course_records.find({ course_id: this.courseId });
        this.userIds = courseRecords.map(function(record) {
          return (<any>record).user_id;
        });
      }, true);
    }
  }