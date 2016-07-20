// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Mongo } from 'meteor/mongo';
	import 'reflect-metadata';
	import 'zone.js/dist/zone';

// Angular Imports
	import { Component, ViewEncapsulation, provide, Input } from '@angular/core';
	import { bootstrap } from 'angular2-meteor-auto-bootstrap';
	import { APP_BASE_HREF } from '@angular/common';
	import { HTTP_PROVIDERS } from '@angular/http';
	import { InjectUser } from 'angular2-meteor-accounts-ui';


// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MeteorComponent } from 'angular2-meteor';
	import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';
	import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
	import { MdToolbar } from '@angular2-material/toolbar';
	import { FORM_DIRECTIVES, FORM_PROVIDERS } from '@angular/forms';

// Icon
	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// Component View Imports
	import { ExploreView } from '../../components/explore/explore.ts';
	import { SearchView } from '../../components/explore/search.ts';

// Define Explore Component
  @Component({
    selector: 'tuxlab-explore',
    templateUrl: '/client/imports/ui/pages/explore/explore.html',
    directives: [ 
      MATERIAL_DIRECTIVES,
      MD_ICON_DIRECTIVES,
      MD_TABS_DIRECTIVES,
      MD_INPUT_DIRECTIVES,
      FORM_DIRECTIVES,
      MdToolbar,
      ExploreView,
      SearchView 
    ],
    providers: [ FORM_PROVIDERS ],
    viewProviders: [ MdIconRegistry ],
    encapsulation: ViewEncapsulation.None
  })

// Export Explore Class
export default class Explore extends MeteorComponent {
  searchQuery: string;
  searchResults: Array<Object>;
  courseCount: number;
  resultsPerPage = 15;
  currentPage = 1;
  
  constructor(mdIconRegistry: MdIconRegistry) {
    super();
    // Create Icon Font
    mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
    mdIconRegistry.setDefaultFontSetClass('tuxicon');
  }

  // Find Course
  findCourse() {
    let searchQuery = (<HTMLInputElement>document.getElementById('search-input')).value;
    if (searchQuery !== '') {
      
      // Switch view
      document.getElementById('explore-view').style.display = 'none';
      document.getElementById('search-view').style.display = 'block';
      document.getElementById('search-input').blur();
      
      this.searchQuery = searchQuery;
      var self = this;
      this.currentPage = 1
      Meteor.call('search_courses', this.searchQuery, this.resultsPerPage, this.currentPage, function(err, res) {
        if(err) {
          console.log(err);
        }
        else {
          self.searchResults = res.course_results;
          self.courseCount = res.course_count;
        }
      });
    }
    else {
      document.getElementById('explore-view').style.display = 'block';
      document.getElementById('search-view').style.display = 'none';
    }
  }

  // Search icon button
  searchFocus() {
    document.getElementById('search-input').focus();
  }
}