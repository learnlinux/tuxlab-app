import {provideRouter, RouterConfig} from '@angular/router';
import { courseRoutes } from './imports/ui/pages/course/course.routes.ts';

// Import pages
import Dashboard from './imports/ui/pages/dashboard/dashboard.ts'
import Login from './imports/ui/pages/account/login.ts'
import Account from './imports/ui/pages/account/account.ts'
import Err404 from './imports/ui/pages/error/404.ts'
import TaskView from './imports/ui/pages/lab/taskview.ts';
import CourseList from './imports/ui/pages/course/course.ts';
import Explore from './imports/ui/pages/explore/explore.ts';
import Terms from './imports/ui/pages/static/terms.ts';
import Privacy from './imports/ui/pages/static/privacy.ts';

// Define Routes
const routes : RouterConfig = [
  ...courseRoutes,
  { path: '', component: Dashboard },
  { path: 'login', component: Login },
  { path: 'lab', component: TaskView },
  { path: 'course', component: CourseList },
  { path: 'explore', component: Explore },
  { path: 'terms', component: Terms },
  { path: 'privacy', component: Privacy },
  { path: 'account/:userid', component: Account },
  { path: '**', component: Err404 }
]

export const ROUTE_PROVIDERS = [
  provideRouter(routes)
];
