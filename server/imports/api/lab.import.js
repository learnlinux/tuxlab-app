var labImport = function(){}
labImport.prototype.check = function(str){
  var tux = eval(str);
  assert(typeof tux.setup === 'function')
  assert(typeof tux.tasks === 'function')
  var tuxOrig = require('./tuxlab.js')
  assert(tux.init.toString() === tuxOrig.init.toString());
  assert(tux.newTask.toString() === tuxOrig.newTask.toString());
}
module.exports = new labImport();
