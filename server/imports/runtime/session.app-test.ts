/**
 Session Test
 tests session creation
**/

import { expect } from 'chai';

import { DefaultFixtures } from '../../../imports/test/fixtures';

import { SessionStatus } from '../../../both/models/session.model';
import { Session } from '../../../server/imports/runtime/session';
import { Sessions } from '../../../both/collections/session.collection';

import { TaskStatus } from '../../../both/models/course_record.model';
import { CourseRecords } from '../../../both/collections/course_record.collection';

export function runTest(){
  describe('Session', () => {

    let fixtures : DefaultFixtures;

    var user : string;
    var lab : string;
    var session : Session;

    before(() => {
      fixtures = new DefaultFixtures();

      user = fixtures.users["course_admin"];
      lab = fixtures.labs["gpi/git"];
    });

    it('Example1 | Create Session', function(){

      return Session.getSession(user, lab)

      // Set Session Globally
      .then((res) => {
         session = res;
      })

      // Validate Course Record Object
      .then(() => {

        // Get Course Record
        var course_record = CourseRecords.findOne({
          user_id : session.user_id,
          course_id : fixtures.courses["gpi"]
        });

        // Find Session Record
        expect(course_record).to.have.property("labs");
        expect(course_record.labs).to.have.property(session.lab_id);
        expect(course_record.labs[session.lab_id]).to.have.property(session._id);
        var session_record = course_record.labs[session.lab_id][session._id]

        // Validate Session Record
        expect(session_record).to.have.property("tasks");
        expect(session_record.tasks).to.have.lengthOf(2);
        expect(session_record.tasks[0]).to.have.property("status");
        expect(session_record.tasks[0].status).to.be.equal( TaskStatus.in_progress );
        expect(session_record.tasks[1]).to.have.property("status");
        expect(session_record.tasks[1].status).to.be.equal( TaskStatus.not_attempted );
      })
    });

    it('Example 1 | Should complete task 0', function(){
      return session.nextTask()

      .then(() => {

        // Get Course Record
        var course_record = CourseRecords.findOne({
          user_id : session.user_id,
          course_id : fixtures.courses["gpi"]
        });

        // Find Session Record
        expect(course_record).to.have.property("labs");
        expect(course_record.labs).to.have.property(session.lab_id);
        expect(course_record.labs[session.lab_id]).to.have.property(session._id);
        var session_record = course_record.labs[session.lab_id][session._id]

        // Validate Session Record
        expect(session_record).to.have.property("tasks");
        expect(session_record.tasks).to.have.lengthOf(2);
        expect(session_record.tasks[0]).to.have.property("status");
        expect(session_record.tasks[0].status).to.be.equal( TaskStatus.success );
        expect(session_record.tasks[1]).to.have.property("status");
        expect(session_record.tasks[1].status).to.be.equal( TaskStatus.in_progress );
      })
    });

    it('Example 1 | Get Session from Cache', function(){
      return Session.getSession(user,lab)
      .then((res) => {
        session = res;
      });
    });

    it('Example 1 | Should fail on task 1', function(){

      // Task Promise Should Fail
      return session.nextTask()
      .then(() => {
        throw "Shouldn't Succeed."
      })
      .catch(() => {
        return null;
      })

      // Session Record Updated
      .then(() => {
        var session_record = Sessions.findOne({ _id : session._id.toString() });
        expect(session_record).to.not.be.null;
        expect(session_record).to.have.property("status");
        expect(session_record.status).to.be.equal(SessionStatus.failed);
      })

      // Course Record Updated
      .then(() => {

        // Get Course Record
        var course_record = CourseRecords.findOne({
          user_id : session.user_id,
          course_id : fixtures.courses["gpi"]
        });

        // Find Session Record
        expect(course_record).to.have.property("labs");
        expect(course_record.labs).to.have.property(session.lab_id);
        expect(course_record.labs[session.lab_id]).to.have.property(session._id);
        var session_record = course_record.labs[session.lab_id][session._id]

        // Validate Session Record
        expect(session_record).to.have.property("tasks");
        expect(session_record.tasks).to.have.lengthOf(2);
        expect(session_record.tasks[0]).to.have.property("status");
        expect(session_record.tasks[0].status).to.be.equal( TaskStatus.success );
        expect(session_record.tasks[1]).to.have.property("status");
        expect(session_record.tasks[1].status).to.be.equal( TaskStatus.failure );
      })

    })
  });
}
