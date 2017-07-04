import 'zone.js';
import 'reflect-metadata';

import { Component } from "@angular/core";

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
