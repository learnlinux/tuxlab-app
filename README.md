# TuxLab
Platform for creating Interactive Linux Courses

[![wercker status](https://app.wercker.com/status/153c62fdbaf17191aed5cacc0a14e150/m "wercker status")](https://app.wercker.com/project/bykey/153c62fdbaf17191aed5cacc0a14e150)

## Running the Development Environment
In order to make development easier, we have created a Vagrant Enviornment to simulate the servers needed to run the TuxLab Site. You can get this up and running by first installing the following pre-requisites:
 * Vagrant
 * Vagrant Hosts Plugin
 * VirtualBox
 * Ansible
 * SSHPass

You can then initialize this environment by running `vagrant up`. Test this installation by running `docker -H tcp://10.100.1.10:2375 info`

## Running on AWS Cloud
You need the following things:
 * Edit the `ansible/aws/vars/`
 * Python, pip
 * `sudo pip install -U boto`
 * Ansible

 Then simply run: `ansible-playbook ./ansible/site.yml`
