/**
  MOCHA TESTS for TUXLAB
  @author: Derek Brown
**/

import * as _ from 'underscore';

import { APITests } from './api/index';

if (Meteor.isServer){
  APITests();
}
