import { provideRouter, RouterConfig } from '@angular/router';
import { courseRoutes } from './imports/ui/pages/course/course.routes.ts';

/* PAGES */
  // Dashboard
  import Dashboard from './imports/ui/pages/dashboard/dashboard.ts'

  // Account
  import Login from './imports/ui/pages/account/login.ts'
  import Account from './imports/ui/pages/account/account.ts'

  // Error
  import Err404 from './imports/ui/pages/error/404.ts'

  // Lab
  import TaskView from './imports/ui/pages/lab/taskview.ts';
  import LabCreate from './imports/ui/pages/lab/labcreate.ts'

  // Course
  import CourseList from './imports/ui/pages/course/course.ts';
  import UserList from './imports/ui/pages/course/course_userlist.ts';

  // Explore
  import Explore from './imports/ui/pages/explore/explore.ts';
  import Terms from './imports/ui/pages/static/terms.ts';

  // Static
  import Privacy from './imports/ui/pages/static/privacy.ts';

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
  { path: 'course-users', component: UserList },
  { path: 'course', component: CourseList },
  { path: 'explore', component: Explore },
  { path: '**', component: Err404 }
]

export const ROUTE_PROVIDERS = [
  provideRouter(routes)
];
