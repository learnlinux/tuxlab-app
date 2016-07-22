
// Angular
import { RouterConfig, CanActivate } from '@angular/router';

// Course Routing
import CourseView from './course.ts';
import { CourseEnroll } from './course.enroll.ts';

// Pages
import { GradeList } from './gradelist.ts';
import { LabList } from './lablist.ts';
import { CourseDashboard } from './course_dashboard.ts';
import { LabView } from './labview.ts';
import { GradeView } from './gradeview.ts';

export const courseRoutes: RouterConfig = [
  {
    path: 'course/:courseid',
    component: CourseView,
    canActivate: [ CourseEnroll ],
    children: [
      { path: '', component: CourseDashboard },
      { path: 'grades', component: GradeList },
      { path: 'labs', component: LabList },
      { path: 'labs/lab', component: LabView },
      { path: 'grades/grade', component: GradeView }
  //  { path: 'users', as: 'UserList', component: UserList },
  //  { path: 'user/:userid', as: 'UserView', component: UserView },
  //  { path: 'labs', as: 'LabList', component: LabList },
  //  { path: 'lab/:labid', as: 'LabView', component: LabView },
    ]
  }
];
