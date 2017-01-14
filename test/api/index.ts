/**
  Server Tests
  CANNOT USE INFRASTRUCTURE
**/

import { CollectionTests } from './collection';
import { RoleTests } from './collection.roles';
import { LabRuntimeTests } from './lab_runtime';

export function APITests() {
  CollectionTests();
  RoleTests();
  LabRuntimeTests();
}
