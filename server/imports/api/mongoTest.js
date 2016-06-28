var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var url = "mongodb://tuxlab:cQPD9wte@ds025792.mlab.com:25792/tuxlab";
var executer = function(){}
executer.prototype.mongo = mongo;
executer.prototype.mongoClient = mongoClient;
executer.fetch(courseId,labId)
mongoClient.connect(url, function (err, db) {
  console.log("here");
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);
    var collection = db.collection('courses');
    
    collection.find().toArray(function (err, result) {
      console.log("hereeee");
      if (err) {
	console.log("err");
        console.log(err);
      } else if (result.length) {
        console.log('Found:', result);
      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
    db.close();
    });
    //Close connection
  }
});
