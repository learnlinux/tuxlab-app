# Database Schema
The following document describes the MongoDB Schema used by the TuxLab app:

### Courses Database
```
{
  _id : "574465a21109160b518a4299",
  course_number: "15-131",
  course_name: "Great Practical Ideas for Computer Scientists",

  labs: [
    {
      lab_id: 1,
      lab_name: "Getting Started with Git",
      labfile: "##################",
      tasks: [
        {
          task_id: 1,
          task_name: "Git Clone",
          task_doc: "##################"
        }
      ]
    }
    {
      lab_id: 2,
      lab_name: "Advanced Git 1",
      labfile: "##################",
      tasks: [
        {
          task_id: 1,
          task_name: "Git Submodules",
          task_doc: "##################"
        }
      ]
    }
  ]
}
```
### Users Database
```
{
  _id : "573de804b17eca6c452d9ff7",
  firstName : "Derek",
  lastName : "Brown",
  email : "derek@tuxlab.org",
  profile_pic : "https://placekitten.com/g/250/250",
  roles: [{administrator: 'global'}, {'instructor' : '574465a21109160b518a4291'}]
  course_records : [
    "574467bc1109160b518a429d",
    "574467a21109160b518a429c",
    "574467fc1109160b518a429e"
  ],
}
```

### Course Records Database
```
{
  _id : "574467bc1109160b518a429d",
  user_id : "573de804b17eca6c452d9ff7",
  course_id : "574465a21109160b518a4299",
  labs: [
    {
      lab_id: 1,
      data: {
        // INSTRUCTORS INJECT DATA
      },
      tasks: [
        {
          task_id: 1,
          status: COMPLETED // ONE OF SUCCESS, FAILURE, SKIPPED, ATTEMPTED, NOT_ATTEMPTED
          grade: {16,100} // TUPLE
          data: {
            // INSTRUCTORS INJECT DATA
          }
        }
      ]
    },
    {
      lab_id: 2,
      data: {
        // INSTRUCTORS INJECT DATA
      },
      tasks: [
        {
          task_id: 1,
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
