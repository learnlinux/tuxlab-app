"use strict";
var lab = require('./lab.js');
var lab_orig = new lab();

/// <reference path="./checkLab.d.ts" />
module.exports = function(labfile){

  if(!labfile) {
    TuxLog.log("warn", "labfile is null");
    return false; 
  } //check for file import
  else{
    try{
      var  lab_obj = eval(labfile);
      if(typeof lab_obj == undefined || typeof lab_obj == null){ //check for lab object
        throw new Error("tux is undefined/null");
      }
      
      else if(typeof lab_obj.setup != 'function'){
        throw new Error("setup is not a function");
      }

      else if(typeof lab_obj.tasks != 'function'){
        throw new Error("tasks is not a function");
      }
      
      else if(lab_obj.init.toString() != lab_orig.init.toString()){
        throw new Error("lab file changes init function");
      }

      else if(lab_obj.newTask.toString() != lab_orig.newTask.toString()){
        throw new Error("lab file changes newTask function");
      }

      else{
        return true;
      }
    }

    catch(e){
      TuxLog.log("warn",e);
      return false;
    }
  }
}
