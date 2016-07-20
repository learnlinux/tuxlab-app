import { RouterConfig } from '@angular/router';
import CourseView from './course.ts';
import { GradeList } from './gradelist.ts';
import { LabList } from './lablist.ts';
import { CourseDashboard } from './course_dashboard.ts';
import { LabView } from './labview.ts';

export const courseRoutes: RouterConfig = [
  {
    path: 'course',
    component: CourseView,
    children: [
      { path: '', component: CourseDashboard },
      { path: 'grades', component: GradeList },
      { path: 'labs', component: LabList },
      { path: 'labs/lab', component: LabView }
  //  { path: '/:courseid', as: 'CourseView', component: CourseView },
  //  { path: '/:courseid/users', as: 'UserList', component: UserList },
  //  { path: '/:courseid/user/:userid', as: 'UserView', component: UserView },
  //  { path: '/:courseid/labs', as: 'LabList', component: LabList },
  //  { path: '/:courseid/lab/:labid', as: 'LabView', component: LabView },
    ]
  }
];
