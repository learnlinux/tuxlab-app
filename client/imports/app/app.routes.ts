
// Angular
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Account
import Dashboard from './account/dashboard.component';

// Course

// Lab

// Static

export const AppRoutes : Routes = [
  { path: '', component: Dashboard, data: [{title:"Dashboard"}] }
]

@NgModule({
  declarations: [
    Dashboard
  ],
  imports: [
    RouterModule.forRoot(
      AppRoutes,
      {
        enableTracing: true, //TODO Debugging Only
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule { }
