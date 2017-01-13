/*
 * TuxLab ETCD Object
 * @author: Derek Brown, Cem Ersoz
 */

import * as fs from 'fs';
import { Etcd } from 'node-etcd';
import { Config } from './config';

const etcd_conn_str =
  Config.get('etcd_node_proto')+"://"+
  Config.get('etcd_node_ip')+":"+
  Config.get('etcd_node_port')

export const etcd = new Etcd(etcd_conn_str, {
  ca: fs.readFileSync(Config.get('ssl_ca')),
  cert: fs.readFileSync(Config.get('ssl_cert')),
  key: fs.readFileSync(Config.get('ssl_key'))
});
