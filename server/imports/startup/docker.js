var dockerode = require('dockerode');
var fs = require('fs');

var dockerode_options = {
    host: nconf.get('swarm_node_ip'),
    port: nconf.get('swarm_node_port')
    ca: fs.readFileSync(nconf.get('swarm_cert_dir')+"/ca.perm"),
    cert: fs.readFileSync(nconf.get('swarm_cert_dir')+"/cert.perm"),
    key: fs.readFileSync(nconf.get('swarm_cert_dir')+"/key.perm")
  };

docker = new dockerode(dockerode_options);
