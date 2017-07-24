import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Meteor } from 'meteor/meteor';
import * as _ from "lodash";

@Injectable()
export default class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router : Router){

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(_.isNull(Meteor.userId())){
      this.router.navigate(['/login', { redirect_url: state.url }]);
      return false;
    } else {
      return true;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route,state);
  }

}
