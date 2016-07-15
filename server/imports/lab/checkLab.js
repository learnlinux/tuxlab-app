"use strict";
var tuxOrig = require('./lab.js');


/// <reference path="./checkLab.d.ts" />
module.exports = function(str){
  if(!str) { return false; } //check for file import
  var tux = eval(str);
  //var s = tuxlab;
  return ((typeof tux != "undefined") &&
          (typeof tux.setup === 'function') &&  //check for instructor field types
          (typeof tux.tasks === 'function') &&
          (tux.init.toString() === tuxOrig.init.toString()) &&  //check for unchanged
          (tux.newTask.toString() === tuxOrig.newTask.toString()));
}
