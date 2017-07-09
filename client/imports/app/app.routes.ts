
// Angular
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdButtonModule, MdListModule, MdInputModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

// Account
import Dashboard from './account/dashboard.component';
import Login from './account/login.component';

// Course

// Lab

// Static
import Help from './static/help.component';
import Legal from './static/legal.component';

export const AppRoutes : Routes = [
  { path: '', component: Dashboard },
  { path: 'help', component: Help },
  { path: 'legal', component: Legal },
  { path: 'login', component: Login }
]

@NgModule({
  declarations: [
    Dashboard,
    Help,
    Legal,
    Login
  ],
  imports: [
    RouterModule.forRoot(
      AppRoutes,
      {
        enableTracing: true,
      }
    ),
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    MdListModule,
    MdButtonModule,
    MdInputModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule { }
