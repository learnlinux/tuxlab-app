# TuxLab
Platform for creating Interactive Linux Courses

[![wercker status](https://app.wercker.com/status/153c62fdbaf17191aed5cacc0a14e150/m "wercker status")](https://app.wercker.com/project/bykey/153c62fdbaf17191aed5cacc0a14e150)

## Installation
TuxLab is heavily dependent on the infrastructure setup.  To simplify the process of setup, we have created a [Ansible playbook](https://github.com/learnlinux/tuxlab-infra) to automatically configure the TuxLab infrastructure.

## Contributing
TuxLab is under active development. If you wish to contribute, discuss on our Gitter page:

[![Gitter](https://badges.gitter.im/learnlinux/tuxlab-app.svg)](https://gitter.im/learnlinux/tuxlab-app?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

### Testing
TuxLab-app uses Gagarin to test application functionality:
* ```npm install -g gagarin```
* ```npm test```
