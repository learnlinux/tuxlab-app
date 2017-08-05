import { Injectable } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import * as _ from "lodash";

import { Users } from '../../../both/collections/user.collection';

@Injectable()
export default class AccountService {
  constructor() {
  }

  loginWithPassword(username: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Meteor.loginWithPassword(username, password, function(err){
        if(err){
          reject(err);
        } else {
          resolve();
        }
      })
    });
  }

  loginWithGoogle() : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Meteor.loginWithGoogle({
        requestPermissions: ['profile', 'email']
      }, (error) => {
        if(error){
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Meteor.logout((e: Error) => {
        if (e) {
          return reject(e);
        }
        resolve();
      });
    });
  }
}
