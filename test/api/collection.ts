/**
  Collection Test
  Tests collection functions
**/

  import { Meteor } from 'meteor/meteor';
  import { expect } from 'chai';
  import * as _ from "underscore";

  // Import Collection Objects
  import { CourseRecords } from '../../both/collections/course_record.collection';
  import { Courses } from '../../both/collections/course.collection';
  import { Labs } from '../../both/collections/lab.collection';
  import { Sessions } from '../../both/collections/session.collection';
  import { Users } from '../../both/collections/user.collection';

  // Import Collection Models
  import { CourseRecord } from '../../both/models/course_record.model';
  import { Course, ContentPermissions, EnrollPermissions } from '../../both/models/course.model';
  import { Lab, LabStatus } from '../../both/models/lab.model';
  import { Session } from '../../both/models/session.model';
  import { User, Role } from '../../both/models/user.model';

  import { ExampleCollectionRecords } from './collection.example';

  export function createTestCollections(){

    it('should contain no extraneous records', function(){
      CourseRecords.remove({});
      Courses.remove({});
      Labs.remove({});
      Sessions.remove({});
      Users.remove({});
    });

    it ('should contain example course', function(done){
      Courses.insert(ExampleCollectionRecords.course, function(err, course_id){
        expect(err).to.not.exist;
        ExampleCollectionRecords.course._id = course_id;
        done();
      });
    });

    it ('should contain example lab', function(done){
      ExampleCollectionRecords.lab.course_id = ExampleCollectionRecords.course._id;

      Labs.insert(ExampleCollectionRecords.lab, function(err, lab_id){
        expect(err).to.not.exist;
        ExampleCollectionRecords.lab._id = lab_id;
        done();
      });
    });

    it ('should contain example users', function(done){
      let users = ['global_admin', 'course_admin', 'instructor', 'student'];

      users.forEach(function(user){
        ExampleCollectionRecords[user]._id =  Users.insert(ExampleCollectionRecords[user])
        expect(ExampleCollectionRecords[user]._id).to.be.a('string');
      });
      done();
    });

    it ('should allow setting user roles', function(done){
      let users = ['course_admin', 'instructor', 'student'];

      users.forEach(function(user){
        Users.setRoleFor(ExampleCollectionRecords.course._id, ExampleCollectionRecords[user]._id, Role[user]);
      });
      done();
    });

    it ('should allow getting user roles', function(done){
      let roles = ['global_admin', 'course_admin', 'instructor', 'student'];

      roles.forEach(function(user){
        expect(Users.getRoleFor(ExampleCollectionRecords.course._id, ExampleCollectionRecords[user]._id)).to.be.equal(Role[user]);
      });
      done();
    });

  }


  export function CollectionTests(){
    describe('Collection', function(){
      createTestCollections();
    });
  }
