/**
  Guards a route by enforcing that the user is logged in.
**/

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { InjectUser } from 'angular2-meteor-accounts-ui';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

/**
  Guards a route by ensuring that a course record has been created for the user.
**/

@InjectUser("user")
@Injectable()
export class GuardAuth implements CanActivate{
  user: Meteor.User;

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    var slf = this;

    var obs : Observable<boolean> = Observable.fromPromise(new Promise<boolean> (function(resolve, reject){

        Meteor.subscribe('course-records', () => {

          // Enroll Authenticated Users
          if(!Meteor.userId()){

            // Create Redirect Query Object
            var redirect;
            if (state.url !== null && typeof state.url !== "undefined"){
              redirect = {redirect : encodeURIComponent(state.url)}
            }

            slf.router.navigate(['/login', redirect ]);
            resolve(false);
          }
          else{
            resolve(true);
          }
        });

      }));

    return obs;
  }
}
