
var student = function(userId, labId, courseId){
  this.userId = userId;
  this.labId = labId;
  this.courseId = courseId;
}

student.prototype.userId = null;
student.prototype.labId = null;
student.prototype.courseId = null;

student.prototype.setGrade = function(taskNo, grade){

  if(typeof taskNo !== 'number'){
    TuxLog.log("warn",new Error("task number is not a number"));  
    throw new Error("task number is not a number");
  }

  else if(taskNo < 1){
    throw new Error("task number is less than 1");
    TuxLog.log("warn", new Error("task number is less than 1"));
  }

  else if(grade.length !== 2){
    TuxLog.log("warn",new Error("grade tuple has more/less than 2 elements"));
    throw new Error("grade tuple should have exactly 2 elements");
  }

  else if(!(typeof grade[0] == 'number' && typeof grade[1] == 'number')){
    TuxLog.log("warn",new Error("grade tuple has non-number elements"));
    throw new Error("grade tuple should consist on numbers");
  }

  else{
    var slf = this;

    //tasks are indexed from 1, arrays from 0
    taskNo -= 1;

    //find records from database
    var courseRecord = Collections.course_records.findOne({user_id: slf.userId, course_id: slf.courseId});
    var labs = courseRecord.labs;
    
    //find specific lab from the labs array
    var i = labs.findIndex(function(lab){
      return lab._id == slf.labId;
    });

    if(i < 0){
      TuxLog.log("warn",new Error("course record not updated with the lab being accessed"));
      throw new Error("course record not updated with the lab being accessed");
    }

    else if(labs.tasks.length <= taskNo){
      TuxLog.log("warn",new Error("number of tasks less than task number"));
      throw new Error("number of tasks less than task number");
    }
    else{
      //modify the grade for the given task
      var lab = labs[i];
      lab.tasks[taskNo].grade = grade;

      //change lab object in array
      labs[i] = lab;

      //update labs in database
      Collections.course_records.update({user_id: slf.userId, course_id: slf.courseId},{$set:{labs: labs}});
    }
  }
}


student.prototype.incrementGrade = function(taskNo, grade){
  
  if(typeof taskNo !== 'number'){
    TuxLog.log("warn",new Error("task number is not a number"));
    throw new Error("task number is not a number");

  }

  else if(taskNo < 1){
    TuxLog.log("warn",new Error("task number is less than 1"));
    throw new Error("task number is less than 1");
  }

  else if(typeof grade !== 'number'){
    TuxLog.log("warn",new Error("grade is not a number"));
    throw new Error("grade should be a number");
  }

  else{
    var slf = this;

    //tasks are indexed from 1, arrays forom 0
    taskNo -= 1;
   
    //find records from database
    var courseRecord = Collections.course_records.findOne({user_id: slf.userId, course_id: slf.courseId});
    var labs = courseRecords.labs;

    //find specific lab from the labs array
    var i = labs.findIndex(function(lab){
      return lab._id == slf.labId;
    });

    if(i < 0){
      TuxLog.log("warn",new Error("course record not updated with lab being accessed"));
      throw new Error("course record not updated with lab being accessed");
    }

    else if(lab.tasks.length <= taskNo){
      TuxLog.log("warn",new Error("number of tasks less than task number"));
      throw new Error("number of tasks less than task number");
    }

    else if(lab.tasks[taskNo].grade[0] + grade > lab.tasks[taskNo].grade[1]){
      TuxLog.log("warn",new Error("trying to increment grade to more than 100%"));
      throw new Error("this would make grade greater than 100%");
    }

    else{
      var lab = labs[i]

      lab.tasks[taskNo].grade[0] += grade;
   
      //change lab object in array
      labs[i] = lab;

      //update mongo collection
      Collections.course_records.update({user_id: slf.userId, course_id: slf.courseId},{$set:{labs: labs}});
    }
  }
}

student.prototype.setTaskData = function(taskNo,data){
  taskNo -=1;
  if(typeof taskNo !== 'number'){
    TuxLog.log("warn",new Error("task number is not a number"));
    throw new Error("task number is not a number");
  }

  else if(taskNo < 1){
    TuxLog.log("warn", new Error("task number is less than 1"));
    throw new Error("task number is less than 1");
  }

  else{
    var slf = this;

    //find records from database
    var courseRecord = Collections.course_records.findOne({user_id: slf.userId, course_id: slf.courseId});
    var labs = courseRecords.labs;

    //find specific lab from the labs array;
    var i = labs.findIndex(function(lab){
      return lab._id = slf.labId;
    });

    if(i < 0){
      TuxLog.log("warn",new Error("course record hasn't been updated with the lab accessed"));
      throw new Error("course record hasn't been updated with the lab accessed");
    }
    else if(lab.tasks.length <= taskNo){
      TuxLog.log("warn",new Error("task number greater than total number of tasks"));
      throw new Error("task number greater than total number of tasks");
    }
    else{

      var lab = labs[i];

      //modify the data for the given task
      lab.tasks[taskNo].data = data;

      //change lab object in array
      labs[i] = lab;

      //update database
      Collections.course_records.update({user_id: slf.userId, course_id: slf.courseId},{$set:{labs: lab}});
    }
  }
}

student.prototype.setLabData = function(data){

  var slf = this;

  //find records from database
  var courseRecord = Collections.course_records.findOne({user_id: slf.userId, course_id: slf.courseId});
  var labs = courseRecord.labs;

  //find specific lab from the labs array
  var i = labs.findIndex(function(lab){
    return lab._id = slf.labId;
  });

  if(i < 0){
    TuxLog.log("warn",new Error("course record hasn't been updated with lab accessed"));
    throw new Error("course record hasn't been updated with lab accessed");
  }
  else{
    
    //update lab data
    var lab = labs[i];
    lab.data = data;    

    //update labs with lab object
    labs[i] = lab;

    //update database
    Collections.course_records.update({user_id: slf.userId, course_id: slf.courseId},{$set:{labs : labs}});
  }
}

student.prototype.getTaskData = function(taskNo){

  var slf = this;
  return function(){
    return new Promise(function(resolve,reject){
      if(taskNo < 1){
        TuxLog.log("warn",new Error("task number should be greater than 1"));
	reject(new Error("task number should be greater than 1"));
      }
      else{

	taskNo -= 1;

	//find records from the database
        var courseRecord = Collections.course_records.findOne({user_id: slf.userId, course_id: slf.courseId});
        var labs = courseRecord.labs;

        //find specific lab from the labs array
        var i = labs.findIndex(function(lab){
          return lab._id = slf.labId;
        });

        if(i < 0){
          TuxLog.log("warn",new Error("course record hasn't been updated with lab accessed"));
          reject(new Error("course record hasn't been updated with lab accessed"));
        }

        else if(labs[i].length <= taskNo){
	  TuxLog.log("warn",new Error("number of tasks less than task number"));
	  reject(new Error("number of tasks less than task number"));
	}

        else{
          resolve(labs[i].tasks[taskNo].data);
        }
      }
    });
  }
}

student.prototype.getLabData = function(){
  var slf = this;
  return function(){
    return new Promise(function(resolve,reject){

      //find records from the database
      var courseRecord = Collections.course_records.findOne({user_id: slf.userId, course_id: slf.courseId});
      var labs = courseRecords.labs;

      //find specific lab from the labs array
      var i =labs.findIndex(function(lab){
        return lab._id = slf.labId;
      });      

      if(i < 0){
        TuxLog.log("warn",new Error("course record hasn't been updated with lab accessed"));
	reject(new Error("course record hasn't been updated with lab accessed"));
      }
      else{
        resolve(labs[i].data);
      }
    });
  }
}
student.prototype.feedBack = function(){}
module.exports = student;
