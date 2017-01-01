import { provideRouter, RouterConfig } from '@angular/router';

/* PAGES */
  // Auth Guard
  import { GuardAuth } from './guard.auth';

  // Dashboard
  import Dashboard from '../pages/dashboard/dashboard'

  // Account
  import Login from '../pages/account/login'
  import Account from '../pages/account/account'

  // Error
  import ErrorPage from '../pages/error/error'

  // Course
  import { courseRoutes } from './course.routes';
  import { CourseGuardRecord } from './course.guard.record';

  // Course List
  import CourseList from '../pages/courselist/courselist';

  // Explore
  import Explore from '../pages/explore/explore';

  // Static
  import Privacy from '../pages/static/privacy';
  import Terms from '../pages/static/terms';

/* ROUTES */
const routes : RouterConfig = [
  ...courseRoutes,
  { path: '', component: Dashboard },
  { path: 'account', canActivate: [ GuardAuth ], component: Account },
  { path: 'account/:userid', canActivate: [ GuardAuth ], component: Account },
  { path: 'login', component: Login },
  { path: 'terms', component: Terms },
  { path: 'privacy', component: Privacy },
  { path: 'explore', component: Explore },
  { path: 'courses', component: CourseList },
  { path: 'error/:code', component: ErrorPage },
  { path: '**', component: ErrorPage }
]

export const ROUTE_PROVIDERS = [
  provideRouter(routes),
  GuardAuth,
  CourseGuardRecord
];
