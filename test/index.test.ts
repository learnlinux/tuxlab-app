/**
  MOCHA TESTS for TUXLAB
  @author: Derek Brown

  Meteor currently doesn't have a way to select which tests are run.  This file
  implements test selectors by passing enviornment variables into the Meteor
  Test function.
**/

import * as _ from 'underscore';

import { ServerTests } from './server/index';

// Parse Test Object
let tests = [];
if(typeof (<any>process.env).TUXLAB_TEST !== "undefined"){
  tests = (<string>(<any>process.env).TUXLAB_TEST).trim().split(',');
}

// Undefined Error
  if(tests.length == 0){
    console.log("NO TESTS WERE RUN. TUXLAB_TEST MUST BE SPECIFIED");
  }

// Client
  if(_.contains(tests, "CLIENT")){

  }

// Server, No-Infra
  if(_.contains(tests, "SERVER")){
    ServerTests();
  }

// Server, With Infra
  if(_.contains(tests, "INFRA")){

  }
