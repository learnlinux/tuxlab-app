import { RouterConfig } from '@angular/router';
import CourseView from './course.ts';
import { CourseGradeList } from './course_gradelist.ts';
import { CourseLabList } from './course_lablist.ts';
import { CourseDashboard } from './course_dashboard.ts';
import { LabView } from './labview.ts';

export const courseRoutes: RouterConfig = [
  {
    path: 'course',
    component: CourseView,
    children: [
      { path: '', component: CourseDashboard },
      { path: 'grades', component: CourseGradeList },
      { path: 'labs', component: CourseLabList },
      { path: 'labs/lab', component: LabView }
  //  { path: '/:courseid', as: 'CourseView', component: CourseView },
  //  { path: '/:courseid/users', as: 'UserList', component: UserList },
  //  { path: '/:courseid/user/:userid', as: 'UserView', component: UserView },
  //  { path: '/:courseid/labs', as: 'LabList', component: LabList },
  //  { path: '/:courseid/lab/:labid', as: 'LabView', component: LabView },
    ]
  }
];