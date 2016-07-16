"use strict";
var tuxOrig = require('./lab.js');


/// <reference path="./checkLab.d.ts" />
module.exports = function(str){
  if(!str) { return null; } //check for file import
  var tux = eval(str);
  if(((typeof tux != "undefined") &&
      (typeof tux.setup === 'function') &&  //check for instructor field types
      (typeof tux.tasks === 'function') &&
      (typeof tux.tasks() != 'undefined') &&
      (tux.init.toString() === tuxOrig.init.toString()) &&  //check for unchanged
      (tux.newTask.toString() === tuxOrig.newTask.toString()))){
    return null;
  }
  else{
    return tux.titleList;
  }
  return null;
}
