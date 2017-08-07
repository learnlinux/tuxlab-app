
// Angular
import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }          from '@angular/forms';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdButtonModule, MdSelectModule, MdListModule, MdInputModule, MdGridListModule, MdDialogModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

// Imports
import { MarkdownModule } from 'angular2-markdown';

// Account
import AccountService from './account/account.service';
import AuthGuard from './account/auth-guard.service';
import Dashboard from './account/dashboard.component';
import Login from './account/login.component';
import { Users } from '../../both/collections/user.collection';

// Course
import CourseList from './course/course_list.component';
import CourseView from './course/course_view.component';

// Lab
import { LabView } from './lab/lab_view.component';
import { ConnectionDetailsDialog } from './lab/lab_view_connection.dialog';
import { MessageDialog } from './lab/lab_view_messages.dialog';
import LabTerminal from './lab/lab_terminal.component';

// Static
import ErrorPage from './static/error.component';
import Help from './static/help.component';
import Legal from './static/legal.component';

export const AppRoutes : Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Account
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'login', component: Login },

  // Static
  { path: 'help', component: Help },
  { path: 'legal', component: Legal },
  { path: 'error/:error_code', component: ErrorPage },

  // Courses
  { path: 'explore', component: CourseList },
  { path: 'courses', component: CourseList, canActivate: [AuthGuard] },
  { path: 'courses/:course_id', component: CourseView },

  // Labs
  { path: 'courses/:course_id/labs/:lab_id', component: LabView, canActivate: [AuthGuard] },

  // Error Route
  { path: '**', redirectTo: '/error/404' }
]

@NgModule({
  declarations: [
    Dashboard,
    Help,
    ErrorPage,
    Legal,
    Login,
    CourseList,
    CourseView,
    LabView,
    LabTerminal,
    ConnectionDetailsDialog,
    MessageDialog
  ],
  imports: [
    RouterModule.forRoot(
      AppRoutes,
      {
        enableTracing: false,
      }
    ),
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    MdListModule,
    MdButtonModule,
    MdInputModule,
    MdSelectModule,
    MdGridListModule,
    MdDialogModule,
    MarkdownModule.forRoot(),
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AccountService,
    AuthGuard
  ],
  entryComponents: [
    ConnectionDetailsDialog,
    MessageDialog
  ]
})
export class AppRoutingModule { }
