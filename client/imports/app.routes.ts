
// Angular
import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }          from '@angular/forms';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdButtonModule, MdSelectModule, MdListModule, MdInputModule, MdGridListModule, MdDialogModule, MdChipsModule, MdTabsModule, MdAutocompleteModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

// Imports
import { MarkdownModule } from 'angular2-markdown';
import { SortablejsModule } from 'angular-sortablejs';

// Dialogs
import SelectUser from './dialogs/select_user.dialog';

// Account
import { AccountView } from './account/account.component';
import AccountService from './account/account.service';
import AuthGuard from './account/auth-guard.service';
import Dashboard from './account/dashboard.component';
import Login from './account/login.component';
import Reset from './account/reset.component';
import CreateUser from './account/create.component';

// Admin
import { AdminView } from './admin/admin_view.component';
import { UserList, UserItem, UserCourseItem, UserSessionItem } from './admin/admin_user_list.component';

// Course
import CourseList from './course/course_list.component';
import CourseView from './course/course_view.component';
import CourseViewLabItem from './course/course_view_lab.component';

// Lab
import { LabView } from './lab/lab_view.component';
import { ConnectionDetailsDialog } from './lab/lab_view_connection.dialog';
import { MessageDialog } from './lab/lab_view_messages.dialog';
import LabTerminal from './lab/lab_terminal.component';
import { SessionList, SessionListItem } from './lab/session_list.component';

// Static
import ErrorPage from './static/error.component';
import Help from './static/help.component';
import Legal from './static/legal.component';

export const AppRoutes : Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Account
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'login', component: Login },
  { path: 'account', component: AccountView, canActivate: [AuthGuard] },
  { path: 'account/reset', component: Reset },
  { path: 'account/create', component: CreateUser },

  // Static
  { path: 'help', component: Help },
  { path: 'legal', component: Legal },
  { path: 'error/:error_code', component: ErrorPage },

  // Admin
  { path: 'admin', component: AdminView, canActivate: [AuthGuard] },

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

    // Account
    AccountView,
    Dashboard,
    Login,
    Reset,
    CreateUser,

    // Static
    Help,
    ErrorPage,
    Legal,

    // Dialogs
    SelectUser,

    // Admin
    AdminView,

    // Course
    CourseList,
    CourseView,
    CourseViewLabItem,

    // Lab
    LabView,
    LabTerminal,
    ConnectionDetailsDialog,
    MessageDialog,
    SessionList,
    SessionListItem,

    // Admin
    UserList,
    UserItem,
    UserCourseItem,
    UserSessionItem
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
    MdChipsModule,
    MdDialogModule,
    MdTabsModule,
    MdAutocompleteModule,
    MarkdownModule.forRoot(),
    SortablejsModule
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
    SelectUser,
    MessageDialog
  ]
})
export class AppRoutingModule { }
