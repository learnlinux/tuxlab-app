// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component, ActivatedRoute } from '@angular/core';

// Define Dashboard Component
  import template from "./reset.component.html";
  import style from "./reset.component.scss";

  @Component({
    selector: 'tuxlab-reset',
    template,
    styles: [ style ]
  })

// Export Dashboard Class
  export default class Reset extends MeteorComponent {
    private token : string;

    constructor(private route: ActivatedRoute) {
      super();
    }

    ngOnInit(){

      // Get Token
      this.route.queryParamMap
        .map(params => params.get('token') || '')
        .subscribe((token) => {
          this.token = token;
        })
    }
  }
