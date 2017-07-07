
// Angular Core
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

// Angular Material
import { MaterialModule, MdToolbarModule, MdSidenavModule, MdButtonModule, MdChipsModule } from '@angular/material';

// App Component
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routes";

@NgModule({
  // Components, Pipes, Directive
  declarations: [
    AppComponent
  ],
  // Entry Components
  entryComponents: [
    AppComponent
  ],
  // Providers
  providers: [
  ],
  // Modules
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    MdToolbarModule,
    MdSidenavModule,
    MdButtonModule,
    MdChipsModule
  ],
  // Main Component
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor() {

  }
}
