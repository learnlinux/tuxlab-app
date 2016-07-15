declare var Collections : any;
declare var TuxLog : any;

var Session = require('../api/lab.session.js');
Meteor.methods({

  /**prepareLab: prepares a labExec object for the current user
   * takes the id of the lab and a callback as parameter
   * callback: (err,pass)
   * implement loading wheel, md fetch, course record create in callback
   */
  'prepareLab': function(labId : number, callback : any){
     var session = Session();
     var uId = Meteor.userId();
     session.init(uId,labId,callback);
  },
  'startLab': function(callback : any){
    /** somehow get session,
     * cache/ram/db/parameter
     * session.start(cb)
     * call startLab callback(err,res) in session.start cb
     */
  },
  'nextTask': function(callback : any){
    /**session.next(cb)
     * cb(err,res) implement loading wheel here
     * call nextTask callback(err,res) in cb
     * change task markdown -frontend
     * change course records if passed
     */
  },
  'endLab': function(callback : any){
    /**session.end(cb)
     * cb(err,res)
     * call endLab callback(err,res) in cb
     * change course records
     * session.env.deleteRecords deletes etcd records,
     * session.env.removeVm removes virtual machines.
     * remove all vms and deleterecords after lab is completed for good. -highly optional
     */
  }
});
