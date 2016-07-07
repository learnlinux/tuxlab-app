# Database Schema
The following document describes the MongoDB Schema used by the TuxLab app:

### Users Database
```javascript
{
  _id : "573de804b17eca6c452d9ff7",
  services: {
    Google: {
      #########
    },
    Facebook: {
      #########
    },
    Github: {
      ########
    }
  },
  profile: {
    first_name : "Derek",
    last_name : "Brown",
    school : "School of Computer Science",
    email : "derek@tuxlab.org",
    picture : "https://placekitten.com/g/250/250"
  },
  roles: {
    'administrator': ['global'],
    'instructor' : ['574465a21109160b518a4291'], // Array of IDs to Courses
    'student': [['574465a21109160b518a4299','574467bc1109160b518a429d']] // Array of Tuples of {CourseID, CourseRecordID}
  }
},
{
  _id : "23123454ab2d765eef993343",
  services: {
    Google: {
      #########
    },
    Github: {
      ########
    }
  },
  profile: {
    first_name : "Cem",
    last_name : "Ersoz",
    email : "cem@tuxlab.org",
    picture : "https://placekitten.com/g/250/250",
  },
  roles: {
    'student' : ['574465a21109160b518a4299','574467a21109160b518a4334']
  }

}
```

### Courses Database
```javascript
{
  _id : "574465a21109160b518a4299",
  course_number: "15-131",
  course_name: "Great Practical Ideas for Computer Scientists",
  instructor_name: "Tom Cortina",
  labs: [
    '574467bc11091623418a429d'
  ]
}
```

### Labs Database
```javascript
{
  _id : "574467bc11091623418a429d",
  course_id : "574465a21109160b518a4299",
  lab_name: "Getting Started with Git",
  updated: 1467905228238, // Epoch time lab was last updated
  hidden: true, // Lab is hidden from students.  Default is true.
  disabled: false, // Lab can no longer be attempted by students. Default is false.
  file: "##################",
  tasks: [
    {
      _id: 1,
      name: "Git Clone",
      md: "##################"
    },
    {
      _id: 2,
      name: "Git Pull",
      md: "##################"
    }
  ]
}
```

### Course Records Database
```javascript
{
  _id : "574467bc1109160b518a429d",
  user_id : "573de804b17eca6c452d9ff7",
  course_id : "574465a21109160b518a4299",
  labs: [
    {
      _id: "574467bc11091623418a429d",
      data: {
        // INSTRUCTORS INJECT DATA
      },
      tasks: [
        {
          status: COMPLETED // ONE OF SUCCESS, FAILURE, SKIPPED, ATTEMPTED, NOT_ATTEMPTED
          grade: {16,100} // TUPLE
          data: {
            // INSTRUCTORS INJECT DATA
          }
        }
      ]
    }
  ]
}
```
