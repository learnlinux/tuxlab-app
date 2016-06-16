/** Test Suite for TuxLab-App
    using Meteor Gagarian (https://github.com/anticoders/gagarin)
**/
describe('tuxlab.task tests',function(){
  var tuxlab = require('../../server/api/tuxlab.js');
  var task1 = tuxlab.newTask("titr","md",function(){},function(){});
  console.log(task1);
  it('should have fields initialized',function(){
    expect(task1).to.have.property('next')
    .and.equal(null);
  });
  it('should have a proper parent',function(){
    expect(task1).to.have.property('prnt')
      .and.equal(tuxlab);
  });
  var task2 = tuxlab.newTask("title2","md2",function(){},function(){});
  it('should have a proper nextTask function',function(){
    var tsk2 = task1.nextTask(task2);
    expect(task1).to.have.property('next')
      .and.equal(task2);
    expect(tsk2).equal(task2);
    /*expect(tuxlab).to.have.property('taskList')
      .and.equal([task2]);*/
  });
  it('should have a proper isLast function',function(){
    expect(task1).to.have.property('isLast');
    expect(task2).to.have.property('isLast');
    expect(task2.isLast()).to.be.true;
    expect(task1.isLast()).to.be.false;
  });
});

describe('more tuxlab.task tests',function(){
  var tuxlab = require('../../server/api/tuxlab.js');
  var task1 = tuxlab.newTask("title1","md1",function(){}, function(){});
  var task2 = tuxlab.newTask("title2","md2",function(){}, function(){});
  var task3 = tuxlab.newTask("title3","md3",function(){}, function(){});
  var task4 = tuxlab.newTask("title4","md4",function(){}, function(){});
  it('should be chained properly',function(){
    var tsk4 = task1.nextTask(task2).nextTask(task3).nextTask(task4);
    expect(tsk4).to.equal(task4);
    expect(task1).to.have.property('next')
      .and.equal(task2)
    expect(task2).to.have.property('next')
      .and.equal(task3)
    expect(task3).to.have.property('next')
      .and.equal(task4)
    expect(task4).to.have.property('next')
     .and.equal(null);
    expect(task1.isLast()).to.be.false
    expect(task2.isLast()).to.be.false
    expect(task3.isLast()).to.be.false
    expect(task4.isLast()).to.be.true
 /* task1.prnt = null;
    task1.next = null;
    task2.prnt = null;
    task2.next = null;
    task3.prnt = null;
    task3.next = null;
    task4.prnt = null;
    task4.next = null;
    expect(tuxlab).to.have.property('taskList')
     .and.equal([task2,task3,task4]);*/
  });
});

describe('tuxlab.init tests',function(){
  var tuxlab = require('../../server/api/tuxlab.js');
  var init = tuxlab.init();
  it('should have a proper parent',function(){
    expect(init).to.have.property('prnt')
      .and.equal(tuxlab);
  });
  it('should have proper fields initialized',function(){
    expect(init).to.have.property('next')
      .and.equal(null);
    expect(init).to.have.property('nextTask');
  });
  it('should initialize tuxlab fields',function(){
 /* expect(tuxlab).to.have.property('currentTask')
      .and.equal(init);
    expect(tuxlab).to.have.property('taskList')
      .and.equal([init]);*/
  });
  var tuxlab1 = require('../../server/api/tuxlab.js');
  var init1 = tuxlab1.init();
  var task1 = tuxlab1.newTask("title","md",function(){},function(){});
  var tsk1 = init1.nextTask(task1);
  it('should have a working nextTask function', function(){
    expect(init1).to.have.property('next')
      .and.equal(task1);
    expect(tsk1).to.equal(task1);
  });
});
