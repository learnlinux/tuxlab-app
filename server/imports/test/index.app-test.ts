/**
  MOCHA TESTS for TUXLAB
  @author: Derek Brown
**/

import * as _ from 'underscore';

import { InfrastructureTests } from './infra/index';

  // Run Infrastructure Tests
  if (Meteor.isServer){
    InfrastructureTests();
  }
