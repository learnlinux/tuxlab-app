import { RouterConfig } from '@angular/router';
import CourseView from './course.ts';
import { GradeView } from './gradeview.ts';
import { LabView } from './labview.ts';
import { MainCourseView } from './mainview.ts';

export const courseRoutes: RouterConfig = [
  {
    path: 'course',
    component: CourseView,
    children: [
      { path: '', component: MainCourseView },
      { path: 'grades', component: GradeView },
      { path: 'labs', component: LabView }    
  //  { path: '/:courseid', as: 'CourseView', component: CourseView },
  //  { path: '/:courseid/users', as: 'UserList', component: UserList },
  //  { path: '/:courseid/user/:userid', as: 'UserView', component: UserView },
  //  { path: '/:courseid/labs', as: 'LabList', component: LabList },
  //  { path: '/:courseid/lab/:labid', as: 'LabView', component: LabView },
    ]
  }
];