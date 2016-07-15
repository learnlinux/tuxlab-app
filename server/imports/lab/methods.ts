declare var Collections : any;
declare var TuxLog : any;

Meteor.methods({

  /** prepareLab: prepares a labExec object for the current user
   *  takes the id of the lab and a callback as parameter
   *  callback: (err,parseTasks,labExec)
   */
  'prepareLab' : function(labId : number, callback : any){
     var session = require('../api/lab.session.js');
     var userid = Meteor.userId();

     /** session.init(userId,labId,cb)
      * cb(err,parsedTasks) cache session in cb, get rid of parsedTasks if unnecessary
      * implement loading wheel here -in callback
      * session.env.getPass(cb) callback(pass) is called, call this here and then call the prepareLab callback
      * what to put in res of callback(err,res)? session obj? true/false? session id?...
      * get task md -frontend
      * create course record
      */
     session.init(userid,labId,function(err,res){
       session.env.getPass(function(err,pass){
         if(err){
      	   TuxLog.log("debug","error getting pass from labVm container: "+err);
      	   callback("Internal Service Error",null);
      	 }
      	 else{
           var resp = {'pass': pass}
      	   callback(null, resp);
      	 }
       });
     });
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
