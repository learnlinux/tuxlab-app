/**
  MOCHA TESTS for TUXLAB
  @author: Derek Brown
**/

import * as _ from 'lodash';

import { InfrastructureTests } from './infra/index';

  // Run Infrastructure Tests
  if (Meteor.isServer){
    InfrastructureTests();
  }
