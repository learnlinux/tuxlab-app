// Meteor Imports
	import { Meteor } from 'meteor/meteor';

// Angular Imports
	import { Component, Input } from '@angular/core';
	import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MeteorComponent } from 'angular2-meteor';
	import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs'
	import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';

// Icon
	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// Courses Database Imports
  import { courses } from '../../../../../collections/courses.ts';

// Define UserList Component
	@Component({
		selector: 'tuxlab-searchview',
		templateUrl: '/client/imports/ui/components/explore/search.html',
		directives: [ MATERIAL_DIRECTIVES,
									ROUTER_DIRECTIVES,
					        MD_TABS_DIRECTIVES,
					        MD_INPUT_DIRECTIVES,
		]
	})

// Export Explore Class
export default class UserList extends MeteorComponent {
  @Input() searchQuery;
  @Input() searchResults;
  @Input() userCount;
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
    if (this.currentPage * this.resultsPerPage < this.userCount) {
      this.currentPage++;
      Meteor.call('search_courses', this.searchQuery, this.resultsPerPage, this.currentPage, function(error, result) {
        if(error) {
          console.log(error);
        }
        else {
          self.searchResults = result.user_results;
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
          self.searchResults = result.user_results;
        }
      });
    }
  }

  getCurrentInfo() {
    var first = ((this.currentPage - 1) * this.resultsPerPage + 1);
    var last;
    if((first + this.resultsPerPage - 1) > this.userCount) {
      last = this.userCount;
    }
    else {
      last = first + this.resultsPerPage - 1;
    }
    if(first > last) {
      this.currentPage = 1;
      first = 1;
    }
    if(this.userCount === 0) {
      first = 0;
    }
    return first + "-" + last + " of " + this.userCount;
  }

}
