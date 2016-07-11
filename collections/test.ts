import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { courses } from './courses.ts';
import { course_records } from './course_records.ts';


// Insert Courses
let course1 = {
	course_number: '15-131',
	course_name: 'Great Practical Ideas for Computer Scientists',
	course_description: {
		content: `
      Throughout your education as a Computer Scientist at Carnegie Mellon,
      you will take courses on programming, theoretical ideas, logic, systems,
      etc. As you progress, you will be expected to pick up the so-called
      “tools of the trade.” This course is intended to help you learn what you
      need to know in a friendly, low-stress, high-support way. We will discuss
      UNIX, LaTeX, debugging and many other essential tools.
    `,
		syllabus: 'The syllabus is here.'
	},
	instructor_name: 'Derek Brown',
	labs: []
}

let course2 = {
	course_number: '15-112',
	course_name: 'Fundamentals of Programming',
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
	instructor_name: 'David Kosbie',
	labs: []
}

let course3 = {
	course_number: '15-122',
	course_name: 'Principles of Imperative Computation',
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
	instructor_name: 'Tom Cortina',
	labs: []
}

let course4 = {
	course_number: '15-150',
	course_name: 'Principles of Functional Programming',
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
	instructor_name: 'Michael Erdman',
	labs: []
}

let course5 = {
	course_number: '15-251',
	course_name: 'Great Theoretical Ideas for Computer Scientists',
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
	instructor_name: 'Bernhard Haeupler',
	labs: []
}

let course6 = {
	course_number: '15-322',
	course_name: 'Introduction to Computer Music',
	course_description: {
		content: `
      Computers are used to synthesize sound, process signals, and compose
      music. Personal computers have replaced studios full of sound recording
      and processing equipment, completing a revolution that began with
      recording and electronics. In this course, students will learn the
      fundamentals of digital audio, basic sound synthesis algorithms, and
      techniques for digital audio effects and processing. Students will apply
      their knowledge in programming assignments using a very high-level
      programming language for sound synthesis and composition. In a final
      project, students will demonstrate their mastery of tools and techniques
      through music composition or by the implementation of a significant
      sound-processing technique.
    `,
		syllabus: 'The syllabus is here.'
	},
	instructor_name: 'Jesse Stiles',
	labs: []
}

if(Meteor.isServer && courses.find().count() === 0) {
  console.log('Insert courses.');
  courses.insert(course1);
  courses.insert(course2);
  courses.insert(course3);
  courses.insert(course4);
  courses.insert(course5);
  courses.insert(course6);
}

if(Meteor.isServer && course_records.find().count() === 0) {
		// Insert Course Records
		let courseRecord1 = {
			user_id: "W29ne928ZHdWTiNL2",
			course_id: (<any>(courses.findOne({ course_number: '15-322' })))._id,
			labs: []
		}

		let courseRecord2 = {
			user_id: "W29ne928ZHdWTiNL2",
			course_id: (<any>(courses.findOne({ course_number: '15-131' })))._id,
			labs: []
		}

		let courseRecord3 = {
			user_id: "W29ne928ZHdWTiNL2",
			course_id: (<any>(courses.findOne({ course_number: '15-251' })))._id,
			labs: []
		}

		console.log('Insert course records');
		course_records.insert(courseRecord1);
		course_records.insert(courseRecord2);
		course_records.insert(courseRecord3);
}


