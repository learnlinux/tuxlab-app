/**
  MOCHA TESTS for TUXLAB
  @author: Derek Brown
**/

import * as _ from 'lodash';

import { Meteor } from 'meteor/meteor';

import { APITests } from './api/index';

if (Meteor.isServer){
  APITests();
}
