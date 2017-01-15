// Import Collection Models
import { CourseRecord } from '../../../../both/models/course_record.model';
import { Course, ContentPermissions, EnrollPermissions } from '../../../../both/models/course.model';
import { Lab, LabStatus } from '../../../../both/models/lab.model';
import { Session } from '../../../../both/models/session.model';
import { User, Role } from '../../../../both/models/user.model';

export let ExampleCollectionRecords = {
  global_admin : {
    _id : "",
    profile: {
      name : "Derek Brown",
      organization : "Carnegie Mellon University",
      email : "derek@example.org",
      picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
    },
    global_admin: true,
    roles: []
  },
  course_admin : {
    _id : "",
    profile: {
      name : "Aaron Mortenson",
      organization : "Carnegie Mellon University",
      email : "aaron@example.org",
      picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
    },
    global_admin: false,
    roles: []
  },
  instructor : {
    _id : "",
    profile: {
      name : "Sander Shi",
      organization : "Carnegie Mellon University",
      email : "sander@example.org",
      picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
    },
    global_admin: false,
    roles: []
  },
  student : {
    _id : "",
    profile: {
      name : "Cem Ersoz",
      organization : "Carnegie Mellon University",
      email : "cem@example.org",
      picture : "https://c2.staticflickr.com/4/3025/2414332460_bb710ed7b3.jpg"
    },
    global_admin: false,
    roles: []
  },
  course : {
    _id: "",
    course_name: "Great Practical Ideas for Computer Scientists",
    course_number: "15-131",
    course_description: {
      content: "Some stuff about content of the course.  HTML allowed.",
      syllabus: "Some stuff about the syllabus.  Markdown allowed."
    },
    featured: false,
    labs: [],
    instructors: [],
    permissions: {
      meta: true,
      content: ContentPermissions.Any,
      enroll: EnrollPermissions.Any
    }
  },
  lab : {
    _id: "",
    name: "Gitting Started with Git",
    description: "Learn basics of Git with GitHub",
    course_id: "",
    updated: Date.now(),
    status: LabStatus.closed,
    file: "Lab = new TuxLab({name : 'GitHub Lab',description: 'Teaches users how to clone a repository.', vm: 'alpine'});",
    tasks: []
  },
  session : {

  }
}
