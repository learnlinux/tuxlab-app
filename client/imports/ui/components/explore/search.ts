// Meteor Imports
  import { Meteor } from 'meteor/meteor';

// Angular Imports
  import { Component, Input } from '@angular/core';
  import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular Material Imports
  import { MeteorComponent } from 'angular2-meteor';
  import { MATERIAL_DIRECTIVES } from 'ng2-material';
  import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';

// Courses Database Imports
  import { courses } from '../../../../../collections/courses.ts';
   
// Icons
  import { MD_ICON_DIRECTIVES } from '@angular2-material/icon';

// Define SearchView Component
  @Component({
    selector: 'tuxlab-searchview',
    templateUrl: '/client/imports/ui/components/explore/search.html',
    directives: [
      MATERIAL_DIRECTIVES,
      MD_TABS_DIRECTIVES,
      MD_ICON_DIRECTIVES,
      ROUTER_DIRECTIVES
    ]
  })

// Export Explore Class
export class SearchView extends MeteorComponent {
  @Input() searchQuery;
  @Input() searchResults;
  @Input() courseCount;
  @Input() currentPage;
  resultsPerPage = 15;
  
  constructor() {
    super();
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
