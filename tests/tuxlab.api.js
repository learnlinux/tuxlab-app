/** Test Suite for TuxLab-App
    using Meteor Gagarian (https://github.com/anticoders/gagarin)
**/
var lab = require('../server/imports/api/lab.js');
var api = new lab();

describe('tuxlab.api.task tests',function(){
  var task1 = api.newTask("title","md",function(){},function(){});
  it('should have fields initialized',function(){
    expect(task1).to.have.property('next')
    .and.equal(null);
  });
  it('should have a proper parent',function(){
    expect(task1).to.have.property('prnt')
      .and.equal(api);
  });
  var task2 = api.newTask("title2","md2",function(){},function(){});
  it('should have a proper nextTask function',function(){
    var tsk2 = task1.nextTask(task2);
    expect(task1).to.have.property('next')
      .and.equal(task2);
    expect(tsk2).equal(task2);
    /*expect(api).to.have.property('taskList')
      .and.equal([task2]);*/
  });
  it('should have a proper isLast function',function(){
    expect(task1).to.have.property('isLast');
    expect(task2).to.have.property('isLast');
    expect(task2.isLast()).to.be.true;
    expect(task1.isLast()).to.be.false;
  });
});

describe('more tuxlab.api.task tests',function(){
  var task1 = api.newTask("title1","md1",function(){}, function(){});
  var task2 = api.newTask("title2","md2",function(){}, function(){});
  var task3 = api.newTask("title3","md3",function(){}, function(){});
  var task4 = api.newTask("title4","md4",function(){}, function(){});
  it('should be chained properly',function(){
    var tsk4 = task1.nextTask(task2).nextTask(task3).nextTask(task4);
    expect(tsk4).to.equal(task4);

    // Test next method
    expect(task1).to.have.property('next')
      .and.equal(task2)
    expect(task2).to.have.property('next')
      .and.equal(task3)
    expect(task3).to.have.property('next')
      .and.equal(task4)
    expect(task4).to.have.property('next')
     .and.equal(null);

    // Test isLast Method
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

describe('tuxlab.api.init tests',function(){
  var init = api.init();
  it('should have a proper parent',function(){
    expect(init).to.have.property('prnt')
      .and.equal(api);
  });
  it('should have proper fields initialized',function(){
    expect(init).to.have.property('next')
      .and.equal(null);
    expect(init).to.have.property('nextTask');
  });
  it('should initialize tuxlab fields',function(){
 /* expect(api).to.have.property('currentTask')
      .and.equal(init);
    expect(api).to.have.property('taskList')
      .and.equal([init]);*/
  });
  var init1 = api.init();
  var task1 = api.newTask("title","md",function(){},function(){});
  var tsk1 = init1.nextTask(task1);
  it('should have a working nextTask function', function(){
    expect(init1).to.have.property('next')
      .and.equal(task1);
    expect(tsk1).to.equal(task1);
  });
});
