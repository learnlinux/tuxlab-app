declare var Collections : any;
var LabSession = require('../api/lab.session.js');
declare var TuxLog : any;
declare var SessionCache : any;

var LabSession = require('../api/lab.session.js');

Meteor.methods({
  /**prepareLab: prepares a labExec object for the current user
   * takes the id of the lab and a callback as parameter
   * callback: (err,pass)
   * implement loading wheel, md fetch, course record create in callback
   */
  'prepareLab': function(user : string, labId : string){
     var session = new LabSession();
     var uId = Meteor.userId();
     var sessionAsync = Meteor.wrapAsync(session.init,session);
     var result;
     var error;
     sessionAsync(uId,labId,function(err,res){
       if(err){
         result = null;
         error = err;
       }  
       else{
         result = res;
         error = null;
       }
     });
     if(error){
       throw new Meteor.Error("Internal Service Error");
     }
     else{
       return result;
     }
  },
  'nextTask': function(labId : string, callback : any){
    /**session.next(cb)
     * cb(err,res) implement loading wheel here
     * call nextTask callback(err,res) in cb
     * change task markdown -frontend
     * change course records if passed
     */
    var uId = Meteor.userId();
    SessionCache.get(uId,labId,function(err,res){
      if(err || !res){
        callback("Internal Service Error",null);
      }
      else{
        res.next(callback);     
        res.next(callback);
      }
    });
  },
  'endLab': function(labId : string, callback : any){
    /**session.end(cb)
     * cb(err,res)
     * call endLab callback(err,res) in cb
     * change course records
     * session.env.deleteRecords deletes etcd records,
     * session.env.removeVm removes virtual machines.
     * remove all vms and deleterecords after lab is completed for good. -highly optional
     */
    var uId = Meteor.userId();
    SessionCache.get(uId,labId,function(err,res){
      if(err || !res){
        callback("Internal Service Error",null);
      }
      else{
        res.end(callback);
      }
    });
  }
});
