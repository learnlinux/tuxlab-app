
// Angular Core
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";

// Angular Material
import { MaterialModule, MdToolbarModule, MdSidenavModule, MdButtonModule, MdChipsModule } from '@angular/material';

// App Component
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routes";

// Accounts Service
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
    MdChipsModule
  ],
  // Main Component
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(private accountService : AccountService) {

  }
}
