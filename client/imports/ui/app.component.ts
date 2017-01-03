import { Component } from "@angular/core";

// Import Template and Style
  import template from "./app.component.html";
  import style from "./app.component.scss";

@Component({
  selector: "tuxlab",
  template,
  styles: [ style ]
})
export class AppComponent {
  constructor() {
  }
}
