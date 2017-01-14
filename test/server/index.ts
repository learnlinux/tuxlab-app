/**
  Server Tests
  CANNOT USE INFRASTRUCTURE
**/

import { CollectionTests } from './collection';
import { LabRuntimeTests } from './lab_runtime';

export function ServerTests() {
  CollectionTests();
  LabRuntimeTests();
}
