// Meteor Imports
  import { MeteorComponent } from 'angular2-meteor';
  
// Angular Imports
  import { Component } from '@angular/core';

// Define CourseGradeList Component
	@Component({
		selector: 'tuxlab-course-gradelist',
    template : `
      <div class="tuxlab-course-gradelist">
        <tuxlab-gradelist></tuxlab-gradelist>
      </div>
    `,
		directives: [
			MATERIAL_DIRECTIVES,
			MD_ICON_DIRECTIVES,
			ROUTER_DIRECTIVES,
			GradeList
		],
		viewProviders: [MdIconRegistry],
		providers: [OVERLAY_PROVIDERS],
		encapsulation: ViewEncapsulation.None
	})

// Export CourseGradeList Class
  export class CourseGradeList extends MeteorComponent {
    constructor(mdIconRegistry: MdIconRegistry) {
      super();
    }
  }