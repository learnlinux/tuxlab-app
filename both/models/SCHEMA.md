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
    nickname: "Derek",
    school : "School of Computer Science",
    email : "derek@tuxlab.org",
    picture : "https://placekitten.com/g/250/250"
  },
  roles: {
    'administrator': ['global'],
    'instructor' : ['574465a21109160b518a4291'], // Array of IDs to Courses
    'student': [['574465a21109160b518a4299','574467bc1109160b518a429d']] // Array of Tuples of {CourseID, CourseRecordID}
  },
  announcements: [
    {
      timeCreated: 1469648536858,
      type: 'lab',
      message: 'Git Lab is due in 2 Weeks',
      link: 'course/1/lab/12'
    }
  ],
  sessions: [
    {
      labId: "574467bc11091623418a429d",
      started: 1469648536858
    },
    {
      labId: "1346m2hjdj9f3kn003nbh93f",
      started: 1469348565858
    }
  ]
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
  },
  announcements: [
    {
      timeCreated: 1469648536858,
      type: 'lab',
      message: 'Git Lab is due in 2 Weeks',
      link: 'course/1/lab/12'
    }
  ]
}
```

### Courses Database
```javascript
{
  _id : "574465a21109160b518a4299",
  course_number: "15-131",
  course_name: "Great Practical Ideas for Computer Scientists",
  instructors: [
    {
      name: "Derek Bro",
      id: "948fhp23irjer9823r3rwef"
    },
    {
      name: "Tom Cortina",
      id: "573de804b17eca6c452d9ff7"
    }
  ],
	course_description: {
		content: "This is the course description.",
		syllabus: "This is the course syllabus"
	},
  featured: false, // Flags courses shown on the explore page
  permissions:{
    meta: true, // Should course appear in explore and search?
    content: "any" | "auth" | "none", // Who should content be visible to?
    enroll: "any" | "none" // Who should be allowed to enroll?
  }
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
      updated: 1467905228238, // Epoch of when this task last changed
      md: "##################"
    },
    {
      _id: 2,
      name: "Git Pull",
      updated: 1467905228238,
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
          status: COMPLETED // ONE OF SUCCESS, FAILURE, SKIPPED, IN_PROGRESS, NOT_ATTEMPTED
          grade: {16,100} // TUPLE
          data: {
            // INSTRUCTORS INJECT DATA
          },
          attempted: [1467903228163, 1467905328235, 1467906228438]
        }
      ],
      attempted: [1467905208238, 1467905728238]
    }
  ]
}
```
