import {provideRouter, RouterConfig} from '@angular/router';

// Import pages
import Dashboard from './imports/ui/pages/dashboard/dashboard'
import Login from './imports/ui/pages/account/login'
import Account from './imports/ui/pages/account/account'
import Err404 from './imports/ui/pages/error/404'
import TaskView from './imports/ui/pages/lab/taskview';
import CourseList from './imports/ui/pages/course/course';
import LabView from './imports/ui/pages/course/lablist';
import GradeView from './imports/ui/pages/course/gradelist';
import Explore from './imports/ui/pages/explore/explore';
import Terms from './imports/ui/pages/static/terms';
import Privacy from './imports/ui/pages/static/privacy';

// Define Routes
const routes : RouterConfig = [
  { path: '', component: Dashboard },
  { path: 'login', component: Login },
  { path: 'lab', component: TaskView },
  { path: 'course', component: CourseList },
  { path: 'labs', component: LabView },
  { path: 'grades', component: GradeView },
  { path: 'explore', component: Explore },
  { path: 'terms', component: Terms },
  { path: 'privacy', component: Privacy },
//  { path: 'course/:courseid', as: 'CourseView', component: CourseView },
//  { path: 'course/:courseid/users', as: 'UserList', component: UserList },
//  { path: 'course/:courseid/user/:userid', as: 'UserView', component: UserView },
//  { path: 'course/:courseid/labs', as: 'LabList', component: LabList },
//  { path: 'course/:courseid/lab/:labid', as: 'LabView', component: LabView },
  { path: 'account/:userid', component: Account },
  { path: '**', component: Err404 }
]

export const ROUTE_PROVIDERS = [
  provideRouter(routes)
];
