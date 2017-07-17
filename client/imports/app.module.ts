
// Angular Core
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";

// Angular Material
import { MaterialModule, MdToolbarModule, MdSidenavModule, MdButtonModule, MdChipsModule, MdProgressSpinnerModule } from '@angular/material';

// External Imports
import { MarkdownModule } from 'angular2-markdown';

// Components
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routes";

// Services
import AccountService from "./account/account.service";

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
    AccountService
  ],
  // Modules
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    MdToolbarModule,
    MdSidenavModule,
    MdButtonModule,
    MdChipsModule,
    MdProgressSpinnerModule,
    MarkdownModule.forRoot()
  ],
  // Main Component
  bootstrap: [ AppComponent ]
})

export class AppModule {
  constructor(private accountService : AccountService) {

  }
}
