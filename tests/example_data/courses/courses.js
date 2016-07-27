/**
  Example Courses Database for the TuxLab Project
**/

module.exports = [
  {
    _id: "1",
    course_name: "Great Practical Ideas for Computer Scientists",
    course_number: "15-131",
    instructors: [
      {
        name: "Super User",
        id: "10"
      },
      {
        name: "Derek Brown",
        id: "1"
      },
      {
        name: "Tom Cortina",
        id: "2"
      }
    ],
    course_description: {
      content: `
        Throughout your education as a Computer Scientist at Carnegie Mellon, 
        you will take courses on programming, theoretical ideas, logic, systems, 
        etc. As you progress, you will be expected to pick up the so-called “tools of the trade.” 
        This course is intended to help you learn what you need to know in a friendly, low-stress, 
        high-support way. We will discuss UNIX, LaTeX, debugging and many other essential tools.
      `,
      syllabus: "The syllabus is here."
    },
    permissions:{
      meta : true,
      content: "any",
      enroll: "any"
    },
    featured: true,
    labs: []
  },
  {
    _id : "2",
    course_number: '15-112',
    course_name: 'Fundamentals of Programming',
    instructors: [
      {
        name: "Super User",
        id: "10"
      },
      {
        name: "Aaron Mortenson",
        id: "3"
      },
      {
        name: "Cem Ersoz",
        id: "4"
      }
    ],
    course_description: {  
      content: `
        A technical introduction to the fundamentals of programming with an
        emphasis on producing clear, robust, and reasonably efficient code using
        top-down design, informal analysis, and effective testing and debugging.
        Starting from first principles, we will cover a large subset of the Python
        programming language, including its standard libraries and programming
        paradigms. We will also target numerous deployment scenarios, including
        standalone programs, shell scripts, and web-based applications. This
        course assumes no prior programming experience.
      `,
      syllabus: 'The syllabus is here.'
    },
    permissions:{
      meta: true,
      content: "auth",
      enroll: "none"
    },
    featured: true,
    labs: []
  },
  {
    _id: "3",
    course_number: '15-122',
    course_name: 'Principles of Imperative Computation',
    instructors: [
      {
        name: "Super User",
        id: "10"
      },
      {
        name: "Tom Cortina",
        id: "2"
      },
      {
        name: "Sander Shi",
        id: "5"
      }
    ],
    course_description: {
      content: `
        This course teaches imperative programming and methods for ensuring the
        correctness of programs. It is intended for students with a basic
        understanding of programming (variables, expressions, loops, arrays,
        functions). Students will learn the process and concepts needed to go
        from high-level descriptions of algorithms to correct imperative
        implementations, with specific applications to basic data structures
        and algorithms. Much of the course will be conducted in a subset of C
        amenable to verification, with a transition to full C near the end.
      `,
      syllabus: 'The syllabus is here.'
    },
    permissions: {
      meta: true,
      content: "any",
      enroll: "any"
    },
    featured: true,
    labs: []
  },
  {
    _id: "4",
    course_number: '15-150',
    course_name: 'Principles of Functional Programming',
    instructors: [
      {
        name: "Super User",
        id: "10"
      },
      {
        name: "Cem Ersoz",
        id: "4"
      }
    ],
    course_description: {
        content: `
          Upon completion of this course, students will have acquired a mastery of
          basic functional programming techniques, including the design of programs
          using types, the development of programs using mathematical techniques
          for verification and analysis, the use of abstract types and modules to
          structure code, and the exploitation of parallelism in applications.
        `,
        syllabus: 'The syllabus is here.'
    },
    permissions:{
      meta: true,
      content: "any",
      enroll: "none"
    },
    featured: true,
    labs: []
  },
  {
    _id: "5",
    course_number: '15-251',
    course_name: 'Great Theoretical Ideas for Computer Scientists',
    instructors: [
      {
        name: "Super User",
        id: "10"
      },
      {
        name: "Aaron Mortenson",
        id: "3"
      }
    ],
    course_description: {
      content: `
        This course is about how to use theoretical ideas to formulate and solve
        problems in computer science. It integrates mathematical material with
        general problem solving techniques and computer science applications.
        Examples are drawn from algorithms, complexity theory, game theory,
        probability theory, graph theory, automata theory, algebra, cryptography,
        and combinatorics. Assignments involve both mathematical proofs and
        programming.
      `,
      syllabus: 'The syllabus is here.'
    },
    permissions:{
      meta: true,
      content: "any",
      enroll: "any"
    },
      featured: true,
    labs: []
  }
]
