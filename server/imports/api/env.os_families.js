//secure keys are not defined, but may be implemented

/** supported linux families for lab virtual machines
 * although instructors can pass system objects like the ones below,
 * no other os has been tested and may not function as expected
 * if the os_family field is not provided, all systems default to alpine
 */
var os_families = {
  //alpine defaults to the tuxlab_labvm image
  alpine: {
    username: "root",
    password: "",
    key: "",
    os_family: "alpine",
    image: "tuxlab_labvm",
    ssh_port: 22
  },

  redhat: {
    username: "",
    password: "",
    key: "",
    os_family: "redhat",
    image: ""
  },

  debian: {
    username: "",
    password: "",
    key: "",
    os_family: "debian",
    image: ""
  },

  arch: {
    username: "",
    password: "",
    key: "",
    os_family: "arch",
    image: ""
  }
}

module.exports = os_families;
