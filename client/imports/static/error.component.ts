// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component } from '@angular/core';
	import { ActivatedRoute } from '@angular/router';
	import { Observable } from 'rxjs/Observable';

// Define Dashboard Component
  import template from "./error.component.html";
  import style from "./error.component.scss";

  @Component({
    selector: 'tuxlab-error',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class ErrorPage extends MeteorComponent {
    constructor(private route: ActivatedRoute) {
      super();
    }

		private error_code : Observable<string>;
		ngOnInit(){
			this.error_code = this.route.params
				.map(params => params['error_code'])
				.distinct()
				.map((x) => {
					return x.toString();
				});
		}
  }
