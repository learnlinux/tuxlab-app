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

      /** IDENTITY EXAMPLE **/
      let lab_id;

      it('should import the identity example', function(){
        let record : LabFileImportOpts = {
          course_id: example_records.course._id,
          file: Identity
        };

        return LabRuntime.createLabRuntime(record)
            .then(function(lab : LabRuntime){
              lab_id = lab.id;
            });
      });

      it('should get the identity example from cache', function(){
        return LabRuntime.getLabRuntime(lab_id);
      });

    });
  }
