/**
  Lab Runtime Test
  tests importing a tabfile, and executing various commands against it.
**/

  import { Meteor } from 'meteor/meteor';
  import { expect } from 'chai';
  import * as _ from 'underscore';

  import { Labs } from '../../both/collections/lab.collection';
  import { LabRuntime, LabFileImportOpts } from '../../server/imports/runtime/lab_runtime';

  import { createTestCollections } from './collection';
  import { ExampleCollectionRecords } from './collection.example';

  // Import Examples
  import { Identity } from './lab_runtime.example';

  export function LabRuntimeTests(){
    describe('Lab Runtime', function(){

      let lab : LabRuntime;
      let lab_id_cache : string;
      let lab_id_mongo : string;

      it('should start with test database', createTestCollections);

      it('should import from file', function(){
        let record : LabFileImportOpts = {
          course_id: ExampleCollectionRecords.course._id,
          file: Identity
        };

        return LabRuntime.createLabRuntime(record)
          .then(function(lab : LabRuntime){
            lab = lab;
            lab_id_cache = lab._id;

            expect(lab.tasks[0].name).to.be.equal("Task 1");
            expect(lab.tasks[1].name).to.be.equal("Task 2");
          });
      });

      it('should re-id in database (for testing)', function(){
        let doc = Labs.findOne({ _id: lab_id_cache });
        doc = _.omit(doc, '_id');
        Labs.remove({ _id: lab_id_cache });
        lab_id_mongo = Labs.insert(doc);
        expect(lab_id_mongo).to.not.equal(lab_id_cache);
      });

      it('should get from cache', function(){
        return LabRuntime.getLabRuntime(lab_id_cache)
          .then(function(runtime){
            expect(runtime._id).to.be.equal(lab_id_cache);
          });
      });

      it('should get from database', function(){
        return LabRuntime.getLabRuntime(lab_id_mongo)
          .then(function(runtime){
            expect(runtime._id).to.be.equal(lab_id_mongo);
          });
      });

    });
  }
