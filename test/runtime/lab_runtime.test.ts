/**
  Lab Runtime Test
  tests importing a tabfile, and executing various commands against it.
**/

  import { Meteor } from 'meteor/meteor';
  import { expect } from 'chai';
  import * as _ from 'underscore';

  import { Labs } from '../../both/collections/lab.collection';
  import { LabRuntime, LabFileImportOpts } from '../../server/imports/runtime/lab_runtime';

  import { createTestCollections, example_records} from '../collection/collection.test';

  // Import Examples
  import { Identity } from './lab_runtime.examples';

  if (Meteor.isServer){
    describe('Lab Runtime', function(){

      it('should start with test database', createTestCollections);

      describe('Example #1 - Identity', function(){
        let lab : LabRuntime;
        let lab_id_cache : string;
        let lab_id_mongo : string;

        it('should import from file', function(){
          let record : LabFileImportOpts = {
            course_id: example_records.course._id,
            file: Identity
          };

          return LabRuntime.createLabRuntime(record)
              .then(function(lab : LabRuntime){
                lab = lab;
                lab_id_cache = lab._id;
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

      })
    });
  }
