import 'zone.js';
import 'reflect-metadata';

// Angular Component
import { Component, ViewEncapsulation, ViewChild, Renderer2  } from "@angular/core";
import { MdSidenav, MdButton } from "@angular/material";
import { ActivatedRoute } from '@angular/router';

// Template
import template from "./app.component.html";
import style from "./app.component.scss";

@Component({
  selector: "tuxlab",
  template,
  styles: [ style ],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  @ViewChild("sidenav") sidenav: MdSidenav;

  private renderer : Renderer2;

  constructor(private render: Renderer2){
    this.renderer = render;
  }

  ngAfterViewInit(){
    this.checkWindowWidth();
    this.renderer.listen(window, 'resize', (event) => {
      this.checkWindowWidth();
    });
  }

  private checkWindowWidth() : void {
    if(window.innerWidth < 768){
      this.sidenav.close();
    } else{
      this.sidenav.open();
    }
  }
}
