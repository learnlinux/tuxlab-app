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

// Component View Imports
	import { ExploreView } from '../../components/explore/explore';
	import { SearchView } from '../../components/explore/search';

// Define Explore Component
	@Component({
		selector: 'tuxlab-explore',
		templateUrl: '/client/imports/ui/pages/explore/explore.html',
		directives: [ MATERIAL_DIRECTIVES,
					  MD_ICON_DIRECTIVES,
					  MD_TABS_DIRECTIVES,
					  MD_INPUT_DIRECTIVES,
					  MdToolbar,
					  ExploreView,
					  SearchView ],
		viewProviders: [ MdIconRegistry ],
		encapsulation: ViewEncapsulation.None
	})

// Export Explore Class
export default class Explore extends MeteorComponent {

	constructor(mdIconRegistry: MdIconRegistry) {
		super();
		// Create Icon Font
		mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
		mdIconRegistry.setDefaultFontSetClass('tuxicon');

		// Set maximum width to full width for search bar
		document.getElementById('tux-content').style.maxWidth = "100%";
	}

	// Find Course
	findCourse() {
		let searchQuery = (<HTMLInputElement>document.getElementById('search-input')).value;
		if (searchQuery !== '') {
			document.getElementById('explore-view').style.display = 'none';
			document.getElementById('search-view').style.display = 'block';
			document.getElementById('search-input').blur();
			document.getElementById('search-string').innerHTML = "Search Results for '" + searchQuery + "'";
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
