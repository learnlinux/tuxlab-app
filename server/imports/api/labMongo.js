var _eval = require('eval');
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var url = "mongodb://tuxlab:cQPD9wte@ds025792.mlab.com:25792/tuxlab";

var labMongo = function(){}
labMongo.prototype.mongo = mongo;
labMongo.prototype.mongoClient = mongoClient;

/* importLab
 * callback is an optional parameter
 * imports labfile from course in the db,
 * calls callback(err,lab) upon completion 
 * err is null if no error
 */
labMongo.prototype.importLab = function(courseId,labId,callback){
  var slf = this;
  mongoClient.connect(url, function(err,db){
    var error = null;
    if(err){
      console.log("mongo connect error: "+err);
      error = err;
    }
    else{
      var collection = db.collection('courses');
      collection.find({_id: courseId}).toArray(function(err,res){
        if(err){
          error = err;
          console.log(err); //mongo find error, perhaps not logged in
        }
        else{
          if(res.length === 0){
            console.log("there is no course with the given ID");
            error = "no course w given ID";
          }
          else if(res.length > 1){
            console.log("there are more than 1 course with the given ID, this is a database error");
            error = "too many courses w same ID";
          }
          else{
            var lab = res[0].labs.find(function(lab){ return lab._id == labId; });
            db.close(function(errr){ 
              error = errr;
              console.log(errr);
              callback(error,lab); });
          }
        }
      });     
    }
  });
}

/* uploadLab
 * callback is an optional parameter
 * uploads labfile into the course in db with next id
 * calls callback(err,lab)
 */
labMongo.prototype.uploadLab = function(courseId, lab, callback){
  var slf = this;       
  var error = null;
  this.mongoClient.connect(url, function(err,db){
    if(err){
      console.log("mongo connection error: "+err);
      error = err;
    }
    else{
      var collection = db.collection('courses');
      collection.find({_id: courseId}).toArray(function(err,res){
        if(err){
          console.log(err); //mongo find error, perhaps not logged in
	  error = err;
        }
        else if(res.length == 0){
          console.log("there is no course with the given ID");
	  error = "no course with ID"
        }
        else if(res.length > 1){
          console.log("there is more than 1 course with the given ID, this is a db err");
	  error = "too many course with ID"
        }
	else{
	  var course = res[0];
 	  var labs = course.labs;
	  lab.id = labs.length;
	  labs.push(lab);
	  course.labs = labs;
          collection.update({_id: courseId},course,db.close(function(err){
	    if(err){
	      error = err;
	    }
	    callback(error,lab);
	  }));
	}
      });
    }
  });
}

