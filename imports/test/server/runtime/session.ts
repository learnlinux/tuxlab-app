/**
 Session Test
 tests session creation
**/

import { DefaultFixtures, cleanupDatabase } from '../../../fixtures';

import { Session } from '../../../../server/imports/runtime/session';

export function SessionTests(){

  describe('Session', () => {
    var fixtures : DefaultFixtures;
    var user : string;
    var lab : string;
    var session : Session;

    before(() => {
      fixtures = new DefaultFixtures();
      user = fixtures.users["course_admin"];
      lab = fixtures.labs["gpi/git"];
    });

    after(() => {
      fixtures.destructor();
    });

    it('Example1 | Create Session',function(){
      this.timeout(5000);

      return Session.getSession(user, lab)
      .then((res) => {
         session = res;
      });
    });

    it('Example 1 | Should complete task 0', () => {
      return session.nextTask();
    });

    it('Example 1 | Should fail on task 1', () => {
      return session.nextTask()
        .then(() => {
          throw "Shouldn't Succeed."
        })
        .catch(() => {
          return null;
        });
    })

  });
}
