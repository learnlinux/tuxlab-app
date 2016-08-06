//Import os_families
var os_families = require('./env.os_families.js');
var util = require('./env.util.js');


/* constructor
 * intializes docker, etcd connection
 */
var env = function(){
  this.util = new util();
  this.util.env = this;
  this.docker = docker;
  this.root_dom = nconf.get('domain_root');
  this.system.host = this.root_dom;
}

//environment variables
env.prototype.labVm = '';
env.prototype.docker = null;
env.prototype.vmList = {};
env.prototype.usr = null;

//dnsKeys
env.prototype.dnsKey = null;
env.prototype.redRouterKey = null;

//dnsValues

//system object

env.prototype.system = {
  username: "",
  password: "",
  host: "",
  key: "",
  os_family: "",
  image: "",
  labVm_id: "",
  containers: [], 
  ssh_port: null,
  node_ip: null
}

//sets user
env.prototype.setUser = function(user){
  this.usr = user;
}

//returns resolved promise for chaining
env.prototype.start = () => { return Promise.resolve() }


//resolved and rejected promise for verifiers
env.prototype.resolve = () => { return Promise.resolve() }
env.prototype.reject = () =>{ return Promise.reject() }



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
      if(this.dnsKey){
        etcd.del(this.dnsKey,{recursive: true}, function(err, res){
	  cb(err);
        });
      }
      else{
        cb(new Error('silly', 'No DNS Key to Delete.'));
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
env.prototype.init = function(system){

  TuxLog.log("trace","initalizing the user environment");
  var slf = this;

  /* create unique labVm name to avoid collisions
   * for usr: cemersoz, at time 1467752963922
   * labvm = "labVm_cemersoz_1467752963922"
   */
  this.labVm = "labVm_"+this.usr+"_"+((new Date).getTime()).toString();
  
  //import os_families
  var os_families = require('./env.os_families.js');

  //set env.system
  if(!system || !system.os_family){
    _.extend(this.system, os_families.alpine);
    _.extend(this.system,system);
  }
  else{
    _.extend(this.system, os_families[system.os_family]);
    _.extend(this.system,system); 
  }

  //declare final options
  //to run docker commands without attaching a-la '-d'
  var crtOptsf = {
    'Image': slf.system.image,
    'Cmd': ['./entry.sh'], 
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

  //declare start options
  var strOptsf = null;

  return new Promise(function(resolve,reject){

    //Check whether environment has been initialized correctly
    if(!slf.usr){
      TuxLog.log('warn',new Error('no env user initialized'));
      reject(new Error("no env user initialized"));
    }
    if(slf.vmList.labVm){
      TuxLog.log('warn',new Error('trying to init env twice'));
      reject(new Error("trying to init env twice"));
    }

    //pull the supplied image if not already present
    //tuxlab_vm image is the current default and is present
    slf.docker.pull(slf.system.image, function(err,stream){
  
      if(err) { 
        TuxLog.log("warn",err);
        reject(err); 
      }

      else{
        TuxLog.log("trace","pulled docker image");

        //create the labVm container
	slf.docker.createContainer(crtOptsf,function(err,container){
          if(err) { 
            TuxLog.log("warn",err);	  
            reject(err); 
	  }

	  else {

            TuxLog.log("trace","created labVm container");

	    //container id to be stored in etcd records
            var containerId = container.id;

	    //start the container
	    container.start(strOptsf,function(err,data){

              if(err) {
                TuxLog.log('warn',err);
	        reject(err);
	      }
	      else {

		TuxLog.log("trace","started labVm container");
                slf.docker.getContainer(containerId).inspect(function(err,container){
		  if(err){
		    TuxLog.log("warn",err);
		    reject(err);
		  }
		  else{

                    TuxLog.log("trace","got container info");

		    var dnsIP = container.Node.IP;
		    slf.system.node_ip = dnsIP;
		    slf.system.labVm_id = containerId;

		    //create etcd records asynchronously
		    async.series([
		      function(callback){
                        //create redrouter etcd record
                        var etcd_redrouter = {
                          docker_container: containerId,
                          port: slf.system.ssh_port,
                          username: slf.system.username,
                          allowed_auth: ["password"]
                        }
                        
			//create redrouter etcd key
			slf.redRouterKey = '/redrouter/SSH::'+slf.usr;

		        etcd.set(slf.redRouterKey, JSON.stringify(etcd_redrouter),function(err,res){
			  if(err){
			    TuxLog.log("warn",err);
			    callback(err);
			  }
			  else{

                            TuxLog.log("trace","created redrouter etcd record");
			    callback(null);
			  }
			});
		      },
		      function(callback){

			//create dns record key
                        var dir = slf.root_dom.split('.');
                        dir.reverse().push(slf.usr);
                        slf.dnsKey = dir.join('/');
                        slf.dnsKey = "/skydns/"+slf.dnsKey;

		        etcd.set(slf.dnsKey,JSON.stringify({host: dnsIP}),function(err,res){
			  if(err){
			    TuxLog.log("warn",err);
			    callback(err);
			  }
			  else{

                            TuxLog.log("trace","created dns etcd record");
			    callback(null);
			  }
			});
		      }
		      //add more records here if needed
		    ],function(err){
		      if(err){
		        reject(err);
		      }
		      else{

                        TuxLog.log("trace","initialized environment successfully");

		        slf.vmList.labVm = slf.labVm;

			resolve();
		      }
		    })
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
env.prototype.createVm = function(opts) {
  var slf = this; 
  
  
  //parse container create and container start options
  //TODO: give these shorter names

  var crtOpt = opts.dockerodeCreateOptions;
  var strOpt = opts.dockerodeStartOptions;

  name = crtOpt.name;

  /* create unique name for the container to be created
   * for usr: cemersoz at time 1467752963922
   * cName = "vm_cemersoz_1467752963922"
   */
  var cName = "vm_"+this.usr+'_'+((new Date).getTime()).toString();
  
  _.extend(strOpt);
  
  //image defaults to alpine
  var img = nconf.get('labvm_default_image');;
  
  //cmd defaults to b/in/sh
  var cmd = ['/bin/sh']

  //change image to opts.img if exists
  if(crtOpt.img){
     img = crtOpt.img;
  }

  //change cmd to opts.cmd if exists
  if(crtOpt.cmd){
    cmd = crtOpt.cmd;
  }

  //declare final options
  var crtOptsf = {Image:img,CMD:cmd}

  //extend the final options with the supplied options
  _.extend(crtOptsf,crtOpt);

  //change the container name to the unique name created, to be mapped internally to instructor name
  crtOptsf.name = cName;


  return function(){
    return new Promise(function(resolve,reject){

      //check for valid name
      if(crtOpt.name == null){
        TuxLog.log('warn',new Error("name not specified for vm to be created"));
        reject(new Error("name not specified for vm to be created"));
      }

      if(_.has(slf.vmList,crtOpt.name)){
        TuxLog.log('warn', new Error('there is already a vm with this name: '+crtOpt.name));
        reject(new Error("there is already a vm with the name: " +crtOpt.name));
      }

      //pull image file if doesn't exist -docker handles checking for existing images
      dck.pull(img,function(err,stream){
        if(err) {
          TuxLog.log('warn',err);
       	  reject(err);
        }

        else {
	
          //create container
          dck.createContainer(crtOptsf,function(err,container){
            if(err) {
              TuxLog.log('debug',err);
              reject(err);
            }
            else{

              //start container
              container.start(strOpt,function(err,data){
                if(err) {
                  TuxLog.log('debug',err);
                  reject(err);
                }
                else{

                  //add container to slf.vmList to keep track
	          slf.vmList[crtOpt.name] = cName;
		  slf.system.containers.push(container.id);
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
       TuxLog.log('warn',new Error("trying to delete non-existing vm"));
       reject(new Error("trying to delete non-existing vm"));
      }
     
      //remove the container
      slf.docker.getContainer(slf.vmList[vmName]).remove(opts,function(err,data){
        if(err){
          TuxLog.log('warn',err);
	  reject(err);
        }
        else{
          resolve();
        }
      });
    });
  }
}


env.prototype.updateVm = function(vmName, opts) {
  var slf = this;
  return function(){
    return new Promise(function(resolve,reject){

      //check for vm existence
      if(!_.has(slf.vmList,vmName)){
        TuxLog.log('warn',new Error('trying to update non-existing vm'));
        reject(new Error('trying to update non-existing vm'));
      }

      else{

        //update container
        slf.docker.getContainer(slf.vmList[vmName]).update(opts,function(err,data){
          if(err){
	    TuxLog.log('debug',err);
            reject(err);
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
    return new Promise(function(resolve,reject){

      //check for vm existence
      if(!_.has(slf.vmList,vmName)){
        TuxLog.log('warn',new Error('trying to run shell on non-existing vm'));
        reject(new Error("trying to run shell on non-existing vm"));
      }

      //declare options to start exec with
      var options = {AttachStdout: true, AttachStderr: true, Cmd: command.split(" ")};

      //initialize exec
      slf.docker.getContainer(slf.vmList[vmName]).exec(options, function(err, exec){

        if(err){
          TuxLog.log('warn',err);
	  reject(err);
        }

        else{
          //start exec
          exec.start({hijack: true, stdin: true, stdout: true, stderr: true},
            function(err, stream){
              if(err){
                TuxLog.log('warn',err);
                reject(err);
              }

              else{
                var dat = ''
                var stdErr = ''

		//parse stream into stdErr and stdOut strings
	        var header = null;
	        stream.on('readable',function(){
	          header = header || stream.read(8);

		  //read the stream to a string
	          while(header !== null){
	            //read the type and payload of the header
                    var type = header.readUInt8(0);
                    var payload = stream.read(header.readUInt32BE(4));

	            if(payload == null){
                       break;//if no more payload, stream should have ended
                    }
		    //split the stream by type
		    else if(type == 1){ //data type
                      dat += payload;  //add payload to data 
                    }
		    else{ //err type
		      stdErr += payload; //add payload to err
		    }
		    //update header
		      header = stream.read(8);
	          }
	        });
	        stream.on('end',function(){
                  resolve(dat,stdErr);
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
  var slf = this;
  this.shell("labVm", "cat /pass")()
    .then(function(sOut,sErr){ 
	    TuxLog.log("trace","got labVm password");

	    slf.system.password = sOut;
	    callback(null,sOut); 
    }, function(err){ callback(err,null)});
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

module.exports = env;
