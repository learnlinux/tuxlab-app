// Import Dockerode and Swarmerode
var dockerode = require('dockerode');
var swarmerode = require('swarmerode');

// Import other libraries
var async = require('async');
var underscore = require('underscore');
var etcd = require('node-etcd');
var nconf = require('nconf');

/* constructor
 * intializes docker, etcd connection
 */
var env = function(){
  var etcd_auth = {
	  user: nconf.get(etcd_user),
	  password: nconf.get(etcd_pass)
	}
  var auth = null;
  this.docker = new dockerode({host: '10.100.1.10', port: '2375'}); //aaron
  this.etcd = new etcd('192.168.56.102:2379',etcd_auth);
  this.root_dom = nconf.get("root_domain");

}

//environment variables
env.prototype.labVm = 'labVm';
env.prototype.docker = null;
env.prototype.vmList = {};                      //list of all vm instances
env.prototype.usr = null;
env.prototype.helixKey = null;
env.prototype.redRouterKey = null;


//sets user
env.prototype.setUser = function(user){
  this.usr = user;
}

//returns resolved promise for chaining
env.prototype.start = function(){
  return Promise.resolve();
}

//function wrappers for api functions for promise chaining
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

/* deleteRecords
 * delete helix and redRouter records for given user
 * callback is optional
 * callback(err) called
 */
env.deleteRecords = function(user,callback){
  if(!this.helixKey || !this.redRouterKey){
    TuxLog.log('silly', 'No Records to Delete!');
  }
  var slf = this;
  async.parallel([
    function(cb){
      if(this.recRouterKey){
        etcd.del(this.redRouterKey,{recursive: true}, function(err, res){
          cb(err);
        });
      }
      else{
        cb(new Error('silly', 'No redRouterKey to Delete.'));
      }
    },
    function(cb){
      if(this.helixKey){
        etcd.del(this.helixKey,{recursive: true}, function(err, res){
	  cb(err);
        });
      }
      else{
        cb(new Error('silly', 'No HelixKey to Delete.'));
      }
    }
  ], function(err, results){
    callback(err);
  });
}

//TODO: Error messages do not make sense

/**
 *init
 * returns a promise to pull alpine -if not yet pulled in the docker node- and
 * create the labVm container with the alpine image
 * @param opts: {{},{}} two options file,dockerodeCreateOptions,dockerodeStartOptions
 * should be defined as {dockerodeCreateOptions: {--your options here--},
			{dockerodeStartOptions: {--your options here--}}
 */
env.prototype.init = function(opts){
  if(!this.usr){
    return new Promise(function(res,rej){
      rej("no user initialized"); //TODO: move this into actual promise?
    });
  }
  //check whether the environment has been initialized
  if(this.vmList.labVm)
    return new Promise(function(res,rej){
      rej("this environment has been initialized before");}); //TODO: move this into actual promise?

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

	  //containerId to be stored in helix
	  else {
	    var containerId = container.id.substring(0,7);
	    container.start(strOpts,function(err,data){
              if(err) { reject(err); }
	      else {
	        //create etcd record file for redrouter
                var etcd_redrouter = {
			docker: containerId,
			port: 22,
			username: "root",
			allowed_auth: ["password"]
			}
		var dir = slf.root_dom.split('.');
		dir.reverse().push(this.usr,'A');
		slf.helixKey = dir.join('/');
		
		slf.redRouterKey = '/redrouter/ssh::'+slf.usr;

	        //set etcd record for redrouter
		etcd.set(slf.redRouterKey,etcd_redrouter,function(err,res){
		  if(err){
                    TuxLog.log('debug', err); //TODO: why not camelCase
		    reject("Error creating redrouter etcd log: "+err); //TODO: how to reject?
		  }
                  
		  //set etcd record for helixdns
		  docker.getContainer(containerId).inspect(function(err,container){
		    if(err){
                      //TODO: are we not logging the error here? is this not debug?
		      reject("docker cannot find the container it just created");
		    }
		    else{
		      etcd.set(slf.helixKey,container.NetworkSettings,function(err,res){
		        if(err){
		          reject("Error creating helixdns etcd log: "+err);
			  //TODO: same as above
		        }
			else{
		          slf.vmList.labVm = slf.labVm;
		          resolve();
			}
                      });

          TuxLog.log('debug', err); //TODO: what error? #kafamdadelisorular

		    }
                  });
                );
		resolve();
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
      { reject("please provide a name for your vm"); }); //TODO: move this into actual promise?

  name = crtOpt.name;

  //checks if there are any containers with the same name in this env
  if(underscore.has(slf.vmList,crtOpt.name)){
   return new Promise(function(resolve,reject){
      reject("there is already a vm running with this name, please choose a new name for your vm");}); //TODO: move this into actual promise?
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
      if(err) { TuxLog.log('debug', err); reject(err); }
      else {
        dck.createContainer(crtOptsf,function(err,container){
          if(err) { reject(err); }
          else{
            container.start(strOpt,function(err,data){
              if(err) { reject(err); }
              else{
	        //resolve(data);
		slf.vmList[crtOpt.name] = cName;
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
    var options = {AttachStdout: true, AttachStderr: true, Cmd: command.split(" ")};
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
	      while(header !== null){
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

env.prototype.getPass = function(vmName,callback){
  this.shell1(vmName, "cat /pass")
    .then(function(sOut){ callback(sOut); }, function(s1,s2,s3){callback(s1,s2,s3);});
}
	//executes bash command in given container
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
