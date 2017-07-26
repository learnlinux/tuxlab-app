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

export const etcd = new Etcd(etcd_conn_str, {
  ca: fs.readFileSync(Meteor.settings['private']['domain']['ssl_ca']),
  cert: fs.readFileSync(Meteor.settings['private']['domain']['ssl_cert']),
  key: fs.readFileSync(Meteor.settings['private']['domain']['ssl_key'])
});
