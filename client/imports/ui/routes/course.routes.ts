
// Angular
import { RouterConfig, CanActivate } from '@angular/router';

// Course Routing
import CourseView from '../pages/course/course.ts';
import { CourseGuardRecord } from './course.guard.record.ts';

// Pages
import { GradeList } from '../pages/course/gradelist.ts';
import { LabList } from '../pages/course/lablist.ts';
import { CourseDashboard } from '../pages/course/course_dashboard.ts';
import { GradeView } from '../pages/course/gradeview.ts';

export const courseRoutes: RouterConfig = [
  {
    path: 'course/:courseid',
    component: CourseView,
    children: [
      { path: '', component: CourseDashboard },
      { path: 'grades', component: GradeList },
      { path: 'labs', component: LabList },
      { path: 'grades/grade', component: GradeView }
  //  { path: 'users', as: 'UserList', component: UserList },
  //  { path: 'user/:userid', as: 'UserView', component: UserView },
  //  { path: 'labs', as: 'LabList', component: LabList },
  //  { path: 'lab/:labid', as: 'LabView', component: LabView },
    ]
  }
];
