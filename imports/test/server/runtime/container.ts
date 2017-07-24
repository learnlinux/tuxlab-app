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

  describe('Containers', () => {

    var containers_test = [
      {
        name : "Alpine LabVM",
        config : "alpine"
      }
    ];

    _.each(containers_test, ({name, config}) => {
        var container;

        it(name + " | should create container", () => {
          container = new Container(config);
          return container.ready();
        });

        it(name + " | should echo back shell input", () => {
          container.shell("echo test").then(([stdout, stderr]) =>{
            expect(stdout).to.be.equal("test");
            expect(stderr).to.be.equal("");
          });
        })

        it(name + " | should delete container", () => {
          return container.destroy();
        })
    });
  })
}
