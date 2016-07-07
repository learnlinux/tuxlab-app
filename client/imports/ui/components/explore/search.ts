// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { Mongo }       from 'meteor/mongo';
	import 'reflect-metadata';
	import 'zone.js/dist/zone';

// Angular Imports
	import { Component, ViewEncapsulation, provide } from '@angular/core';
	import { bootstrap } from 'angular2-meteor-auto-bootstrap';
	import { APP_BASE_HREF, FORM_DIRECTIVES } from '@angular/common';
	import { HTTP_PROVIDERS } from '@angular/http';
	import { InjectUser } from 'angular2-meteor-accounts-ui';

// Angular Material Imports
	import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MeteorComponent } from 'angular2-meteor';
	import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs'
	import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
	import { MdToolbar } from '@angular2-material/toolbar';

// Icon
	import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon';

// Courses Database Imports
  import { courses } from '../../../../../collections/courses';

// Define SearchView Component
	@Component({
		selector: 'tuxlab-searchview',
		templateUrl: '/client/imports/ui/components/explore/search.html',
		directives: [ MATERIAL_DIRECTIVES, 
					  MD_ICON_DIRECTIVES, 
					  MD_TABS_DIRECTIVES,
					  MD_INPUT_DIRECTIVES,
					  MdToolbar ],
		viewProviders: [ MdIconRegistry ],
		encapsulation: ViewEncapsulation.None
	})
	
// Export Explore Class 
export class SearchView extends MeteorComponent {

	courses: Array<any> = [];
	pagination = {
		currentPage: 1,
		itemsPerPage: 15,
		totalItems: this.courses.length
	};
	pagedCourses: Array<any> = [];
	
	constructor(mdIconRegistry: MdIconRegistry) {
		super();
		
		// Create Icon Font
		mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
		mdIconRegistry.setDefaultFontSetClass('tuxicon');
    
    // Subscribe Courses Database
    //this.getCourses();
		this.subscribe('all-courses', () => {
			this.courses = courses.find().fetch();
			this.pagination.totalItems = this.courses.length;
			this.refreshCourses();
		}, true);
	}
	
	// Refresh Courses List
	refreshCourses() {
		let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
		let end = start + this.pagination.itemsPerPage;
		this.pagedCourses = this.courses.slice(start, end);
	}
	
	// Display the infomation of current state of pagination
	getCurrentInfo() {
		// This is the number of the first item on the current page
		let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + 1;
		
		// Set the end number to be the number of the last item on the page
		// Check in case there are less than itemsPerPage items on the page
		let end = 0;
		if ((start + this.pagination.itemsPerPage - 1) > this.pagination.totalItems) {
			end = this.pagination.totalItems;
		}
		else {
			end = start + this.pagination.itemsPerPage - 1;
		}
		
		return start.toString() + "-" + end.toString() + " of " + this.pagination.totalItems.toString();
	}
	
	// Go to next page function
	nextPage() {
		
		// Get the current page
		let currentPage = this.pagination.currentPage;
		
		// Get the last possible page
		let lastPage = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);
		
		// Check if the current page is the last page
		if (currentPage !== lastPage) {
			this.pagination.currentPage ++;
			this.refreshCourses();
		}
	}
	
	// Go to previous page function
	prevPage() {	
		
		// Get the current page
		let currentPage = this.pagination.currentPage;
		
		// Check if the current page is the first page
		if (currentPage !== 1) {
			this.pagination.currentPage --;
			this.refreshCourses();
		}
	}
}

