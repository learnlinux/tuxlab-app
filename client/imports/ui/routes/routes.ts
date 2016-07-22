import { provideRouter, RouterConfig } from '@angular/router';

/* PAGES */
  // Dashboard
  import Dashboard from '../pages/dashboard/dashboard.ts'

  // Account
  import Login from '../pages/account/login.ts'
  import Account from '../pages/account/account.ts'

  // Error
  import Err404 from '../pages/error/404.ts'

  // Lab
  import TaskView from '../pages/lab/taskview.ts';
  import LabCreate from '../pages/lab/labcreate.ts'

  // Course
  import { courseRoutes } from './course.routes.ts';
  import { CourseEnroll } from './course.enroll.ts';

  // Explore
  import Explore from '../pages/explore/explore.ts';
  import Terms from '../pages/static/terms.ts';

  // Static
  import Privacy from '../pages/static/privacy.ts';

/* ROUTES */
const routes : RouterConfig = [
  ...courseRoutes,
  { path: '', component: Dashboard },
  { path: 'account', component: Account },
  { path: 'account/:userid', component: Account },
  { path: 'login', component: Login },
  { path: 'terms', component: Terms },
  { path: 'privacy', component: Privacy },
  { path: 'lab-view', component: TaskView },
  { path: 'lab-create', component: LabCreate },
  { path: 'explore', component: Explore },
  { path: '**', component: Err404 }
]

export const ROUTE_PROVIDERS = [
  provideRouter(routes),
  CourseEnroll
];
