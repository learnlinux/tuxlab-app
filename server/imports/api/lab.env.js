// Import Dockerode
var dockerode = require('dockerode');
// Import other libraries
var _ = require('underscore');
var Etcd = require('node-etcd');
var nconf = require('nconf');

/* constructor
 * intializes docker, etcd connection
 */
var env = function(){

  var docker_settings = {
	  host: nconf.get('swarm_node_ip'),
	  port: nconf.get('swarm_node_port')
  }
/*
  var etcd_auth = {
          user: nconf.get('etcd_user'),
          pass: nconf.get('etcd_pass')
  };
  var etcd_address = nconf.get('etcd_node_ip')+':'+nconf.get('etcd_node_port');
  this.etcd = new Etcd(etcd_address,etcd_auth);
  */
  this.docker = new dockerode(docker_settings);
  this.root_dom = nconf.get('domain_root');
  console.log(this.root_dom);
}

//environment variables
env.prototype.labVm = '';
env.prototype.docker = null;
env.prototype.vmList = {};
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

/* deleteRecords
 * delete helix and redRouter records for given user
 * callback is optional
 * callback(err) called
 */
env.deleteRecords = function(user,callback){
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


/**
 *init
 * returns a promise to pull alpine -if not yet pulled in the docker node- and
 * create the labVm container with the alpine image
 * @param opts: {{},{}} two options file,dockerodeCreateOptions,dockerodeStartOptions
 * should be defined as {dockerodeCreateOptions: {--your options here--},
			{dockerodeStartOptions: {--your options here--}}
 */
env.prototype.init = function(opts){

  /* create unique labVm name to avoid collisions
   * for usr: cemersoz, at time 1467752963922
   * labvm = "labVm_cemersoz_1467752963922"
   */
  this.labVm = "labVm_"+this.usr+"_"+((new Date).getTime()).toString();

  var dck = this.docker;

  //get default image
  var img = nconf.get('labvm_default_image');
  var crtOpts = null
  var strOpts = null;

  //parse container create and container start options
  if(opts){
    crtOpts = opts.dockerodeCreateOptions;
    strOpts = opts.dockerodeStartOptions;
  }

  //declare final options
  var crtOptsf = {
    'Image': img,
    'Cmd': ['/bin/sh'], 
    'name': this.labVm,
    'Hostname': '',
    'User': '',
    'AttachStdin': false,
    'AttachStdout': false,
    'AttachStderr': false,
    'Tty': true,
    'OpenStdin': false,
    'StdinOnce': false,
    'Env': null,
    'Volumes': {},
    'VolumesFrom': ''
  }
  var strOptsf = {attach: false, detach: true};
  //change final options according to opts input, if there is any
  _.extend(crtOptsf, crtOpts);

  var slf = this;
  return new Promise(function(resolve,reject){

    //Check whether environment has been initialized correctly
    if(!slf.usr){
      TuxLog.log('debug','no env user initialized');
      reject("Internal Error");
    }
    if(slf.vmList.labVm){
      TuxLog.log('labfile_error','trying to init env twice');
      reject("Internal error");
    }

    //pull the supplied image if not already pulled
    dck.pull(img, function(err,stream){
      if(err) { reject(err); }
      else{
	//create container
	dck.createContainer(crtOptsf,function(err,container){
          if(err) { reject(err); }

	  //containerId to be stored in helix
	  else {
	    var containerId = container.id.substring(0,7);
	    container.start(strOptsf,function(err,data){

        if(err) {
	        TuxLog.log('warn','container start err: '+err);
	        reject("Internal error");
	      }
	      else {
            var etcd_redrouter = {
        			docker: containerId,
        			port: 22,
        			username: "root",
        			allowed_auth: ["password"]
			      }

            		//etcd directory for helix record
            		var dir = slf.root_dom.split('.');
            		dir.reverse().push(slf.usr,'A');
            		slf.helixKey = dir.join('/');
            		slf.redRouterKey = '/redrouter/ssh::'+slf.usr;

            	        //set etcd record for redrouter
            		etcd.set(slf.redRouterKey,etcd_redrouter,function(err,res){
            		  if(err){
                                TuxLog.log('debug', 'error creating redrotuer etcd record: '+err);
            		    reject("Internal error");
            		  }
                          else{
            		  //set etcd record for helixdns
            		  slf.docker.getContainer(containerId).inspect(function(err,container){
            		    if(err){
            		      TuxLog.log('warn', 'docker cannot find the container it just created: '+err);
            		      reject("Internal error");
            		      //TODO: get the actual information that we actually want. Perhaps change this entirely
            		    }
            		    else{

            		      //set etcd record for helix
            		      etcd.set(slf.helixKey,container.NetworkSettings,function(err,res){
            		        if(err){
            			  TuxLog.log('warn','error creating helix etcd record: '+err);
            		          reject("Internal error");
            		        }
            			else{
            		          slf.vmList.labVm = slf.labVm;
            		          resolve();
                                }
                             });
                           }
                         });
                       }
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
env.prototype.createVm = function(opts) {
  var dck = this.docker;
  var fn1 = null;
  //parse container create and container start options
  var crtOpt = opts.dockerodeCreateOptions;
  var strOpt = opts.dockerodeStartOptions;

  name = crtOpt.name;
  /* create unique name for the container to be created
   * for usr: cemersoz at time 1467752963922
   * cName = "vm_cemersoz_1467752963922"
   */
  var cName = "vm_"+this.usr+'_'+((new Date).getTime()).toString();
  _.extend(strOpt,{daemon: true});
  //image defaults to alpine
  var img = nconf.get('labvm_default_image');;
  if(crtOpt.img) img = crtOpt.img;

  var crtOptsf = {Image:img,CMD:['/bin/sh']}
  console.log("here");
  //extend the final options with the supplied options
  _.extend(crtOptsf,crtOpt);
  crtOptsf.name = cName;
  //this.vmList.push({name: crtOpt.name,id:cName});
  //clone this into slf to use in the promise
  var slf = this;
  return function(){
    return new Promise(function(resolve,reject){

      //check for valid name
      if(crtOpt.name == null){
        TuxLog.log('labfile_error',"name not specified for vm");
        reject("Internal error");
      }

      if(_.has(slf.vmList,crtOpt.name)){
        TuxLog.log('labfile_error', 'there is already a vm with this name: '+crtOpt.name);
        reject("Internal error");
      }

      dck.pull(img,function(err,stream){
        if(err) {
          TuxLog.log('debug', "docker pull error: "+err);
       	  reject("Internal error");
        }
        else {
          dck.createContainer(crtOptsf,function(err,container){
            if(err) {
              TuxLog.log('debug','docker create error: '+err);
              reject("Interlan error");
            }
            else{
              container.start(strOpt,function(err,data){
                if(err) {
                  TuxLog.log('debug','docker start error: '+err);
                  reject();
                }
                else{
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
}


//takes the id or containerName of a vm and removes the vm, also removing it
//from the vmList
env.prototype.removeVm = function (vmName,opts) {
  var slf = this;
  return function(){
    return new Promise(function(resolve,reject){

     //check if container initialized
     if(!_.has(this.vmList,vmName)){
        TuxLog.log('labfile_error',"trying to delete non-existing vm");
        reject("Internal error");
      }

      slf.vmList[vmName].remove(opts,function(err,data){
        if(err){
          TuxLog.log('debug',"error removing container: "+err);
	  reject("Internal error");
        }
        resolve();
      });
    });
  }
}


env.prototype.updateVm = function(vmName, opts) {
  var slf = this;
  return function(){
    return new Promise(function(resolve,reject){
      if(!_.has(slf.vmList,vmName)){
        TuxLog.log('labfile_error','trying to update non-existing vm');
        reject("Internal error");
      }
      else{
        slf.docker.getContainer(slf.vmList[vmName]).update(opts,function(err,data){
          if(err){
	    TuxLog.log('debug','error updating container: '+err);
            reject("Internal error");
          }
          else{
	    resolve();
          }
        });
      }
    });
  }
}

env.prototype.shell = function(vmName,command,opts) {
  var slf = this;
  return function(){
    console.log("in env.shell");
    return new Promise(function(resolve,reject){
      if(!_.has(slf.vmList,vmName)){
        TuxLog.log('labfile_error','trying to run shell on non-existing vm');
        reject("Internal error");
      }
      var options = {AttachStdout: true, AttachStderr: true, Cmd: command.split(" ")};
      slf.docker.getContainer(slf.vmList[vmName]).exec(options, function(err, exec){
        if(err){
          TuxLog.log('warn','error trying to container.exec: '+err);
	  reject("Internal error");
        }
        else{
          exec.start({hijack: true, stdin: true, stdout: true, stderr: true},
          function(err, stream){
            if(err){
              TuxLog.log('warn','error trying to exec.start: '+err);
              reject("Internal error");
            }
            else{
              var dat = ''
              var stdErr = ''
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
	        });//TODO: split stdout and stderr
	      stream.on('end',function(){

	        if(stdErr ===''){ resolve(dat); }
	        else{ reject(dat,stdErr,null) }
	      });
	   }
	  });
        }
      });
    });
  }
}

/* gets pass for given virtual machine
 * calls callback(password)
 */
env.prototype.getPass = function(callback){
  console.log("hereeee");
  TuxLog.log("warn","here in getPass");
  this.shell("labVm", "cat /pass")()
    .then(function(sOut){ callback(null,sOut); }, function(s1,s2,s3){
	    if(s1){ callback(s1,s3) }
	    else{ callback(s2,s3) }
    });
}
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
