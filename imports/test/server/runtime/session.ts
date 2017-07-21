/**
 Session Test
 tests session creation
**/

import { DefaultFixtures, cleanupDatabase } from '../../../fixtures';

import { Session } from '../../../../server/imports/runtime/session';

export function SessionTests(){

  describe('Session', function(){
    let fixtures : DefaultFixtures;
    let user : string;
    let lab : string;
    let session : Session;

    before(function(){
      fixtures = new DefaultFixtures();
      user = fixtures.users["course_admin"];
      lab = fixtures.labs["gpi/git"];
    });

    after(function(){
      fixtures.destructor();
    });

    it('should create sessions', function(done){
      Session.getSession(user, lab)
      .then(function(res){
         session = res;


         done();
      });
    });

    it('should complete task 1', function(){
      return session.nextTask();
    })

  });
}
