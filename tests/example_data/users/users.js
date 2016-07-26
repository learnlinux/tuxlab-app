/**
 * Example Users Database for the Tuxlab Project
**/

module.exports = [
  {
    _id: "1",
    services: {
      Google:{}
    },
    profile:{
      first_name: "Derek",
      last_name: "Brown",
      nickname: "DBro",
      school: "CMU SCS",
      email: "derek@tuxlab.org",
      picture: "https://placekitten.com/g/250/250"
    },
    roles:{
      instructor: ["1"],
      student: ["2"]
    }
  },
  {
    _id: "2",
    services: {
      Google: {},
      Facebook: {}
    },
    profile:{
      first_name: "Tom",
      last_name: "Cortina",
      nickname: "Cortana",
      school: "SCS",
      email: "tom@tuxlab.org",
      picture: "https://placekitten.com/g/250/250"
    },
    roles:{
      instructor: ["3","1"]
    }
  },
  {
    _id: "3",
    services: {
      Google:{}
    },
    profile:{
      first_name: "Aaron",
      last_name: "Mortenson",
      nickname: "Amortens",
      school: "CMU SCS",
      email: "aaron@tuxlab.org",
      picture: "https://placekitten.com/g/250/250"
    },
    roles:{
      instructor: ["2","5"],
      student: ["1","3","4"]
    }
  },
  {
    _id: "4",
    services: {
      Facebook: {},
      Github: {}
    },
    profile:{
      first_name: "Cem",
      last_name: "Ersoz",
      nickname: "cemersoz",
      school: "CMU SCS",
      email: "cem@tuxlab.org",
      picture: "https://placekitten.com/g/250/250"
    },
    roles:{
      instructor: ["2","4"],
      student: ["1","4"]
    }
  },
  {
    _id: "5",
    services: {
      Google: {}
    },
    profile:{
      first_name: "Sander",
      last_name: "Shi",
      nickname: "sandershihacker",
      school: "CMU SCS",
      email: "sander@tuxlab.org",
      picture: "https://placekitten.com/g/250/250"
    },
    roles:{
      instructor: ["3"],
      student: ["1","2"]
    }
  }

]
