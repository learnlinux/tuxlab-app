var _eval = require('eval');
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var url = "mongodb://tuxlab:cQPD9wte@ds025792.mlab.com:25792/tuxlab";

var labMongo = function(){}
labMongo.prototype.mongo = mongo;
labMongo.prototype.mongoClient = mongoClient;

labMongo.prototype.importLab = function(courseId,labId,callback){
  var slf = this;
  mongoClient.connect(url, function(err,db){
    if(err){
      console.log("mongo connect error: "+err);
    }
    else{
      var collection = db.collection('courses');
      collection.find({_id: courseId}).toArray(function(err,res){
        if(err){
          console.log(err); //mongo find error, perhaps not logged in
        }
        else{
          if(res.length === 0){
            console.log("there is no course with the given ID");
          }
          else if(res.length > 1){
            console.log("there are more than 1 course with the given ID, this is a database error");
          }
          else{
            var lab = res[0].labs.find(function(lab){ return lab._id == labId; });
            db.close(function(errr){ 
              console.log(errr);
              callback(lab); });
          }
        }
      });     
    }
  });
}
labMongo.prototype.uploadLab = function(courseId, lab){
  var slf = this;       
  this.mongoClient.connect(url, function(err,db){
    if(err){
      console.log("mongo connection error: "+err);
    }
    else{
      var collection = db.collection('courses');
      collection.find({_id: courseId}).toArray(function(err,res){
        if(err){
          console.log(err); //mongo find error, perhaps not logged in
        }
        else if(res.length == 0){
          console.log("there is no course with the given ID");
        }
        else if(res.length > 1){
          console.log("there is more than 1 course with the given ID, this is a db err");
        }
	else{
	  var course = res[0];
 	  var labs = course.labs;
	  lab.id = labs.length;
	  labs.push(lab);
	  course.labs = labs;
          collection.update({_id: courseId},course,db.close);
	}
      });
    }
  });
}

