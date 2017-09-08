/*
 * TuxLab ETCD Object
 * @author: Derek Brown, Cem Ersoz
 */

import * as fs from 'fs';
import * as Etcd from 'node-etcd';

const etcd_conn_str =
  Meteor.settings['private']['env']['etcd_node_proto']+"://"+
  Meteor.settings['private']['env']['etcd_node_ip']+":"+
  Meteor.settings['private']['env']['etcd_node_port']

var etcd_options;
if (  Meteor.settings['private']['env']['etcd_node_proto'] === "https"){
  etcd_options = {
    ca: fs.readFileSync(Meteor.settings['private']['domain']['ssl_ca']),
    cert: fs.readFileSync(Meteor.settings['private']['domain']['ssl_cert']),
    key: fs.readFileSync(Meteor.settings['private']['domain']['ssl_key'])
  }
} else {
  etcd_options = {};
}

export const etcd = new Etcd(etcd_conn_str, etcd_options);
