
// Angular
import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdButtonModule, MdListModule, MdInputModule, MdGridListModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

// Account
import AccountService from './account/account.service';
import Dashboard from './account/dashboard.component';
import Login from './account/login.component';

// Course
import CourseList from './course/course_list.component';


// Lab

// Static
import Help from './static/help.component';
import Legal from './static/legal.component';

export const AppRoutes : Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'help', component: Help },
  { path: 'legal', component: Legal },
  { path: 'login', component: Login },
  { path: 'courses', component: CourseList }
]

@NgModule({
  declarations: [
    Dashboard,
    Help,
    Legal,
    Login,
    CourseList
  ],
  imports: [
    RouterModule.forRoot(
      AppRoutes,
      {
        enableTracing: true,
      }
    ),
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    MdListModule,
    MdButtonModule,
    MdInputModule,
    MdGridListModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AccountService
  ]
})
export class AppRoutingModule { }
