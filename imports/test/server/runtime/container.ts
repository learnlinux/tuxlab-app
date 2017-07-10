/**
  Container Test
  tests starting a container
**/

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import * as _ from 'lodash';

import { VMConfig } from '../../../../server/imports/api/vmconfig';
import { Container } from '../../../../server/imports/runtime/container';

export function ContainerTests() {

  describe('Container', function(){
    let container;
    const vmconfig : VMConfig = 'alpine';

    it('can be created from config', function(){
      container = new Container(vmconfig);
      return container.ready();
    });


    it('can execute shell commands', function(){
      return container.shell("echo 'test';").then(([stdout, stderr]) =>{
        expect(stdout).to.be.equal("test");
        expect(stderr).to.be.equal("");
      });
    });

    it('can be obtained from container_id', function(){
       let container2 = new Container(vmconfig, container.id);
       return container2.ready().then(() => {
         return container2.shell("echo 'test';").then(([stdout, stderr]) =>{
           expect(stdout).to.be.equal("test");
           expect(stderr).to.be.equal("");
         });
       });
    })

  })
}
