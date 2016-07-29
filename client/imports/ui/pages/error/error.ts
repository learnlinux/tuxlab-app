/* TuxLab - TuxLab.ts */

// Angular Imports
  import { Component, Input } from '@angular/core';
  import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router'
  import { MeteorComponent } from 'angular2-meteor';


// Define TuxLab Component
  @Component({
    selector: 'tuxlab-error',
    templateUrl: '/client/imports/ui/pages/error/error.html',
    directives: [
      ROUTER_DIRECTIVES
    ]
  })

export default class ErrorPage extends MeteorComponent {
  private code : string = this.route.snapshot.params['code'];
  private subtext : string = "";
  private message : string = 'If you believe this is an error <a href = "mailto:webmaster@tuxlab.org">please contact the webmaster</a>';

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit(){
    if(typeof this.code === "undefined" || this.code === null || this.code === "" || this.code === "404"){
      this.code = "404";
      this.subtext = "Page Not Found";
    } else if (this.code === "500"){
      this.subtext = "Internal Error";
    } else {
      this.code = "404";
      this.subtext = "Page Not Found";
    }
  }
}
