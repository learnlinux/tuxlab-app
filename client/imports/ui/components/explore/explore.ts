// Meteor Imports
	import { Meteor } from 'meteor/meteor';

// Angular Imports
	import { Component } from '@angular/core';

// Angular Material Imports
	import { MATERIAL_DIRECTIVES } from 'ng2-material';
	import { MeteorComponent } from 'angular2-meteor';

// Collections
	declare var Collections: any;

// Define ExploreView Component
	@Component({
		selector: 'tuxlab-exploreview',
		templateUrl: '/client/imports/ui/components/explore/explore.html',
		directives: [
			MATERIAL_DIRECTIVES
		],
	})

// Export ExploreView Class
export class ExploreView extends MeteorComponent {

	exploreCourses: Array<any> = [];

	constructor() {
		super();

		this.subscribe('explore-courses', () => {
			this.exploreCourses = Collections.courses.find({ "featured": true }).fetch();
		}, true);
	}
}
