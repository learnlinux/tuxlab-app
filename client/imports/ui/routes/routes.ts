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
  import LabView from '../pages/lab/labview.ts';
  import LabCreate from '../pages/lab/labcreate.ts'

  // Course
  import { courseRoutes } from './course.routes.ts';
  import { CourseGuardRecord } from './course.guard.record.ts';

  // Course List
  import CourseList from '../pages/courselist/courselist.ts';

  // Explore
  import Explore from '../pages/explore/explore.ts';

  // Static
  import Privacy from '../pages/static/privacy.ts';
  import Terms from '../pages/static/terms.ts';

/* ROUTES */
const routes : RouterConfig = [
  ...courseRoutes,
  { path: '', component: Dashboard },
  { path: 'account', component: Account },
  { path: 'account/:userid', component: Account },
  { path: 'login', component: Login },
  { path: 'terms', component: Terms },
  { path: 'privacy', component: Privacy },
  { path: 'lab-view', component: LabView },
  { path: 'lab-create', component: LabCreate },
  { path: 'explore', component: Explore },
  { path: 'courses', component: CourseList },
  { path: '**', component: Err404 }
]

export const ROUTE_PROVIDERS = [
  provideRouter(routes),
  CourseGuardRecord
];
