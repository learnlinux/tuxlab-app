//importing dockerode and swarmerode
var dockerode = require('dockerode');
var swarmerode = require('swarmerode');
var underscore = require('underscore');
var etcd = require('node-etcd');

function isPromise(obj){ return obj && typeof obj.then === 'function'; }
var dir = (nconf.get("root_domain").split('.'));
dir.reverse().push("john");
var dd = dir.join('/')


Promise.prototype.next = function(nextPromise){
  var slf = this;
  var lst = [function(){ return slf; }, function(){ return nextPromise; }];
  return waterfall(lst);
}


/* env constructor
 * intializes variables and creates the lab virtual machine, putting it in
 * the vmList
 */

/* constructor
 * intializes docker connection
 */
var env = function(){

  //this.labVm = dockerode.createContainer();
  this.docker = new dockerode({host: '10.100.1.10', port: '2375'}); //aaron
  this.etcd = new Etcd('192.168.56.102','2379');
  this.root_dom = nconf.get("root_domain");
}

env.prototype.setUrl = function(usr){
  this.usr = usr
}

//environment variables
env.prototype.labVm = 'labVm';
env.prototype.docker = null;
env.prototype.vmList = [];                      //list of all vm instances
env.prototype.usr = null;
/*env.prototype.init = function(opts){
  var slf = this;
  return (function(){ return slf.init1(opts); });
}*/
env.prototype.start = function(){
  return Promise.resolve();
}
env.prototype.createVm = function(opts){
  var slf = this;
  return (function(){ return slf.createVm1(opts); });
}
env.prototype.updateVm = function(vmName,opts){
  var slf = this;
  return (function(){ return slf.updateVm1(vmName,opts); });
}
env.prototype.removeVm = function(vmName,opts){
  var slf = this;
  return (function(){ return slf.removeVm1(vmName,opts); });
}
env.prototype.shell = function(cont,com,opts){
  var slf = this;
  return (function(){ return slf.shell1(cont,com,opts) });
}
/**
 *init
 * returns a promise to pull alpine -if not yet pulled in the docker node- and
 * create the labVm container with the alpine image
 * @param opts: {{},{}} two options file,dockerodeCreateOptions,dockerodeStartOptions
 * should be defined as {dockerodeCreateOptions: {--your options here--},
			{dockerodeStartOptions: {--your options here--}}
 */
env.prototype.init = function(opts){
  var fn1 = null;
  var usr = this.usr;
  var dir = this.root_dom.split('.');
  dir.reverse().push(usr,'A');
  var dd = dir.join('/');
  var eJson = { NAME: usr+'.'+this.root_dom,
	        TTL: 3600,
		TYPE: 'A',
		DATA: 'IP'}; //TODO: change this to dynamically get the IP
  //check whether the environment has been initialized
  if(this.vmList.find(function(a){ return a.name == "labVm"; }))
    return new Promise(function(res,rej){
      rej("this environment has been initialized before");});

  //create unique labVm name to avoid collisions
  this.labVm = "labVm"+((new Date).getTime()).toString();
  var dck = this.docker;

  //image defaults to alpine
  var img = 'alpine'

  var crtOpts = null
  var strOpts = null;

  //parse container create and container start options
  if(opts){
    crtOpts = opts.dockerodeCreateOptions;
    strOpts = opts.dockerodeStartOptions;
  }

  //declare final options
  var crtOptsf = {Image: 'alpine',CMD: ['/bin/sh'], name: this.labVm}

  //change final options according to opts input, if there is any
  underscore.extend(crtOptsf, crtOpts);
  //this.vmList.push({name: "labVm",id:this.labVm});
  var slf = this;
  return new Promise(function(resolve,reject){
    //pull the supplied image if not already pulled
    dck.pull(img, function(err,stream){
      if(err) { reject(err); }
      else{
	dck.createContainer(crtOptsf,function(err,container){
          if(err) { reject(err); }
	  else {
	    container.start(strOpts,function(err,data){
              if(err) { reject(err); }
	      else {
                //add labVm to vmList
	        //add labVm properties to etcd db
		etcd.set('/redbird/'+usr+'.'+slf.root_dom,{Docker: slf.labVm},function(){
		  etcd.set(dd,eJson,function(){
		    slf.vmList.push({name: "labVm", id: slf.labVm});
		    resolve();
                  });
                });
	      }
	    });
	  }
        });
      }
    });
  });
}


/* creates a new container with an image from the options provided,
 * downloads image if it does not yet exist.
 * @param {{},{}} : two options file, dockerodeCreateOptions,dockerodeStartOptions
 * should be defined as {dockerodeCreateOptions: {--your options here--},
			{dockerodeStartOptions: {--your options here--}}
 */
//also starts said vm
env.prototype.createVm1 = function(opts) {
  var dck = this.docker;
  var fn1 = null;
  //parse container create and container start options
  var crtOpt = opts.dockerodeCreateOptions;
  var strOpt = opts.dockerodeStartOptions;

  //checks whether name for virtual machine is supplied
  if(crtOpt.name == null)
    return new Promise(function(resolve,reject)
      { reject("please provide a name for your vm"); });

  name = crtOpt.name;

  //checks if there are any containers with the same name in this env
  if(this.vmList.find(function(a){ console.log("checking: "+a); return a.name == name; })){
    console.log("here");
   return new Promise(function(resolve,reject){
      reject("there is already a vm running with this name, please choose a new name for your vm");});
  }

  //create unique name for the container to be created
  var cName = "vm"+((new Date).getTime()).toString();

  //image defaults to alpine
  var img = 'alpine';
  if(crtOpt.img) img = crtOpt.img;

  var crtOptsf = {Image:img,CMD:['/bin/sh']}

  //extend the final options with the supplied options
  underscore.extend(crtOptsf,crtOpt);
  crtOptsf.name = cName;
  //this.vmList.push({name: crtOpt.name,id:cName});
  //clone this into slf to use in the promise
  var slf = this;
  return new Promise(function(resolve,reject){
    dck.pull(img,function(err,stream){
      if(err) { console.log("couldnt pull"); reject(err); }
      else {
        dck.createContainer(crtOptsf,function(err,container){
          if(err) { reject(err); }
          else{
            container.start(strOpt,function(err,data){
              if(err) { reject(err); }
              else{
//              console.log("{name: crtOpt.name,id: cName");
	        //resolve(data);
		slf.vmList.push({name: crtOpt.name, id: cName});
		resolve();
              }
	    });
	  }
        });
      }
    });
  });
}



//takes the id or containerName of a vm and removes the vm, also removing it
//from the vmList
env.prototype.removeVm1 = function (vmName,opts) {
  var i = this.vmList.indexOf(vmName)
  var isInstance = i > -1;
  if(isInstance){
    var cont = this.docker.getContainer(vmName);
  }
  var slf = this;
  return function(){
    return new Promise(function(resolve,reject){
      if(!isInstance){ reject( "this is not an existing vm you created" ); }
      else{
	slf.vmList.splice(i,1);
        cont.remove(opts,function(err,data){
          if(err) { reject(err); }
	  else { resolve(data); }
        });
      }
    });
  }
}

	//calls container.remove
env.prototype.updateVm1 = function(vmName, opts) {
  var i = this.vmList.indexOf(vmName)
  var isInstance = i > -1;
  if(isInstance){ this.vmList.splice(i,-1);
    var cont = this.docker.getContainer.vmName
  }
  return new Promise(function(resolve,reject){
    if(!isInstance){ reject("this is not an existing vm you created\n if you are trying to create a new container you can call \"env.createContainer\""); }
    else{
      cont.update(opts,function(err,data){
        if(err){ reject(err); }
        else{ resolve(data); }
      });
    }
  });
}

env.prototype.shell1 = function(container,command,opts) {
  return new Promise(function(resolve,reject){
    options = {AttachStdout: true, AttachStderr: true, Cmd: command.split(" ")};
    container.exec(options, function(err, exec){
      if(err){ reject("","",err); }
      else{
        exec.start({hijack: true, stdin: true, stdout: true, stderr: true},
	function(err, stream){
          if(err){ reject("","",err); }
          else{
            var dat = ''
	    var err = ''
	    var header = null;
	    stream.on('readable',function(){
	      header = header || stream.read(8);
	      while(header !== nul){
	        var type = header.readUInt8(0);
	        var payload = stream.read(header.readUInt32BE(4));
	        if(payload == null) break;
		else{ dat += payload; }
		  header = stream.read(8);
	        }
	      });
	    stream.on('end',function(){
	      if(err ===''){ resolve(dat); }
	      else{ reject(dat,err,null) }
	    });
	  }
	});
      }
    });
  });
}
	//executes bash command in given container
env.prototype.loadImage = function() {}		//Don't know what this does
env.prototype.importImage = function() {}	//Don't know what this does
env.prototype.getNetwork = function() {}	//Don't know what this does
env.prototype.getVolume = function() {}		//Don't know what this does
env.prototype.getExec = function() {} 		//Don't know what this does
env.prototype.listImages = function() {}	//lists all images available
env.prototype.createVolume = function () {} //Don't know what this does
env.prototype.listVolumes = function() {}	//Don't know what this does
env.prototype.createNetwork = function() {}	//Don't know what this does
env.prototype.listNetworks = function() {}	//Don't know what this does
env.prototype.run = function() {}			//Runs Docker commands
module.exports = new env();
