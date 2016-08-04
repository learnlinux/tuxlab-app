
// Angular
import { RouterConfig, CanActivate } from '@angular/router';

// Course Routing
import CourseView from '../pages/course/course.ts';
import { GuardAuth } from './guard.auth.ts';
import { CourseGuardRecord } from './course.guard.record.ts';

// Pages
import { GradeList } from '../pages/course/gradelist.ts';
import { LabList } from '../pages/course/lablist.ts';
import { CourseDashboard } from '../pages/course/course_dashboard.ts';
import { GradeView } from '../pages/course/gradeview.ts';
import LabCreate from '../pages/lab/labcreate.ts'
import LabView from '../pages/lab/labview.ts';

export const courseRoutes: RouterConfig = [
  {
    path: 'course/:courseid',
    component: CourseView,
    children: [
      { path: '', component: CourseDashboard },
      { path: 'grades', component: GradeList },
      { path: 'labs', component: LabList },
      { path: 'labs/:labid', canActivate: [ GuardAuth, CourseGuardRecord ], component: LabView },
      { path: 'grades/:gradeid', canActivate: [ GuardAuth ], component: GradeView },
      { path: 'lab-create', component: LabCreate }
  //  { path: 'users', as: 'UserList', component: UserList },
  //  { path: 'user/:userid', as: 'UserView', component: UserView },
  //  { path: 'labs', as: 'LabList', component: LabList },
  //  { path: 'lab/:labid', as: 'LabView', component: LabView },
    ]
  }
];
