"use strict";
module.exports = function(str){

  if(!str) { return false; }
    var tux = eval(str);
    //var s = tuxlab;
    var tuxOrig = require('./tuxlab.js');
    return ((typeof tux != "undefined") && 
            (typeof tux.setup === 'function') &&  //check for instructor field types
            (typeof tux.tasks === 'function') &&
            (tux.init.toString() === tuxOrig.init.toString()) &&  //check for unchanged
            (tux.newTask.toString() === tuxOrig.newTask.toString()));
    
}
