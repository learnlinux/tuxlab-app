import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Roles } from '../../../../collections/users.ts';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

declare var Collections : any;

/**
  Guards a route by ensuring that a course record has been created for the user.
**/

@InjectUser("user")
@Injectable()
export class CourseGuardRecord implements CanActivate{
  user: Meteor.User;

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    var slf = this;

    // Get Params
    const course_id : string = (<any>state).parent(route).params.courseid;
    const lab_id : string = (<any>route).params.labid;

    var obs : Observable<boolean> = Observable.fromPromise(new Promise<boolean> (function(resolve, reject){

        Meteor.subscribe('course-records', () => {

          // Enroll Authenticated Users
          if(Meteor.userId()){
            var course_record = Collections.course_records.findOne({user_id: slf.user._id, course_id: course_id});
            if (typeof course_record !== "undefined" && course_record !== null){
              resolve(true);
            }
            else{
              Meteor.call('createUserCourseRecord',[course_id, Meteor.userId()], function(err){
                if(err){
                  slf.router.navigate(['error/500']);
                  resolve(false);
                }
                else{
                  resolve(true);
                }
              });
            }
          }
          else{

            // Create Redirect Query Object
            var redirect;
            if (state.url !== null && typeof state.url !== "undefined"){
              redirect = {redirect : encodeURIComponent(state.url)}
            }

            slf.router.navigate(['/login', redirect ]);
            resolve(false);
          }
        });

      }));

    return obs;
  }
}
