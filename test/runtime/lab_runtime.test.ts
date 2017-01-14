/**
  Lab Runtime Test
  tests importing a tabfile, and executing various commands against it.
**/

  import * as fs from 'fs';
  import { Meteor } from 'meteor/meteor';

  import { LabRuntime, LabFileImportOpts } from '../../server/imports/runtime/lab_runtime';

  import { createTestCollections, example_records} from '../collection/collection.test';

  // Import Examples
  import { Identity } from './lab_runtime.examples';

  if (Meteor.isServer){
    describe('Lab Runtime', function(){

      it('should start with test database', createTestCollections);

      it('should import the simple example', function(){
        let record : LabFileImportOpts = {
          course_id: example_records.course._id,
          file: Identity
        };

        return LabRuntime.createLabRuntime(record);
      });
    });
  }
