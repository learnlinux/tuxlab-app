import { Component } from "@angular/core";

// Import Template and Style
  import template from "./app.component.html!text";
  import style from "./app.component.scss!text";

@Component({
  selector: "tuxlab",
  template,
  styles: [ style ]
})
export class AppComponent {
  constructor() {
  }
}
