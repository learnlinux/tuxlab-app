// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo }       from 'meteor/mongo';
  import 'reflect-metadata';
  import 'zone.js/dist/zone';

// Angular Imports
  import { Component, ViewEncapsulation, provide, Input } from '@angular/core';
  import { bootstrap } from 'angular2-meteor-auto-bootstrap';
  import { APP_BASE_HREF, FORM_DIRECTIVES } from '@angular/common';
  import { HTTP_PROVIDERS } from '@angular/http';
  import { InjectUser } from 'angular2-meteor-accounts-ui';
  import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular Material Imports
  import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MeteorComponent } from 'angular2-meteor';
  import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs'
  import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
  import { MdToolbar } from '@angular2-material/toolbar';

// Icon
  import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// Courses Database Imports
   import { courses } from '../../../../../collections/courses.ts';

// Define SearchView Component
	@Component({
		selector: 'tuxlab-searchview',
		templateUrl: '/client/imports/ui/components/explore/search.html',
		directives: [ MATERIAL_DIRECTIVES, 
      MD_ICON_DIRECTIVES, 
      MD_TABS_DIRECTIVES,
      ROUTER_DIRECTIVES,
      MD_INPUT_DIRECTIVES,
      MdToolbar 
    ],
		viewProviders: [ MdIconRegistry ],
		encapsulation: ViewEncapsulation.None
	})
	
// Export Explore Class 
export class SearchView extends MeteorComponent {
  @Input() searchQuery;
  @Input() searchResults;
  @Input() courseCount;
  @Input() currentPage;
  resultsPerPage = 15;
  constructor(mdIconRegistry: MdIconRegistry) {
    super();
    // Create Icon Font
    mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
    mdIconRegistry.setDefaultFontSetClass('tuxicon');
  }

  // Go to next page function
  nextPage() {
    let self = this;
    if (this.currentPage * this.resultsPerPage < this.courseCount) { 
      this.currentPage++;
      Meteor.call('search_courses', this.searchQuery, this.resultsPerPage, this.currentPage, function(error, result) {
        if(error) {
          console.log(error);
        }
        else {
          self.searchResults = result.course_results;
        }
      });
    }
  }

  // Go to previous page function
  prevPage() {	
    let self = this;
    if(this.currentPage > 1) {
      this.currentPage--;
      Meteor.call('search_courses', this.searchQuery, this.resultsPerPage, this.currentPage, function(error, result) {
        if(error) {
          console.log(error);
        }
        else {
          self.searchResults = result.course_results;
        }
      });
    }
  }
  
  getCurrentInfo() {
    var first = ((this.currentPage - 1) * this.resultsPerPage + 1);
    var last;
    if((first + this.resultsPerPage - 1) > this.courseCount) {
      last = this.courseCount;
    }
    else {
      last = first + this.resultsPerPage - 1;
    }
    if(first > last) {
      this.currentPage = 1;
      first = 1;
    }
    if(this.courseCount === 0) {
      first = 0;
    }
    return first + "-" + last + " of " + this.courseCount;
  }
  
}
