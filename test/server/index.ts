/**
  Server Tests
  CANNOT USE INFRASTRUCTURE
**/

import { CollectionTests } from './collection/collection';
import { LabRuntimeTests } from './runtime/lab_runtime';

export function ServerTests() {
  CollectionTests();
  LabRuntimeTests();
}
