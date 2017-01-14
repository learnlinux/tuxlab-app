/**
  Lab Runtime Test
  tests importing a tabfile, and executing various commands against it.
**/

  import { Meteor } from 'meteor/meteor';

  import { LabRuntime, LabFileImportOpts } from '../../server/imports/runtime/lab_runtime';

  if (Meteor.isServer){
    describe('Lab Runtime', function(){

      it('should import the simple example', function(done){
        done();
      });
    });
  }
