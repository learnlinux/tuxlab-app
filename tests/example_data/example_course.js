/**
  Example Data for the 15-131
**/

// Import LabFile
var course_labfile = require('fs').readFileSync('./tests/example_data/example_labfile.js', "utf8").toString();

var course_obj = {
  course_number: "15-131",
  course_name: "Great Practical Ideas for Computer Scientists",
	course_description: `
		Throughout your education as a Computer Scientist at Carnegie Mellon,
    you will take courses on programming, theoretical ideas, logic, systems, etc.
    As you progress, you will be expected to pick up the so-called “tools of the
    trade.” This course is intended to help you learn what you need to know in a
    friendly, low-stress, high-support way. We will discuss UNIX, LaTeX,
    debugging and many other essential tools.
	`,
  instructor_name: "Tom Cortina",
  file: course_labfile,
  labs: [
    {
      _id: 1,
      lab_name: "Getting Started with Git",
      file: course_labfile,
      tasks: [
        {
          _id: 1,
          name: "Git Clone",
          md: "Git Clone Testing!"
        }
      ]
    }
  ]
}

module.exports = course_obj;


// More Sample Data
/*
var myCourse1 = {
	course_number: '15-122',
	course_name: 'Principles of Imperative Programming',
	course_description: `
		This course teaches imperative programming and methods for ensuring the correctness 
		of programs. It is intended for students with a basic understanding of programming 
		(variables, expressions, loops, arrays, functions). Students will learn the process 
		and concepts needed to go from high-level descriptions of algorithms to correct 
		imperative implementations, with specific applications to basic data structures 
		and algorithms. Much of the course will be conducted in a subset of C amenable 
		to verification, with a transition to full C near the end.		
	`,
	instructor_name: 'Tom Cortina',
	labs: [ 
		'574467bc11091623418a429d',
		'574467bc110as623418a429d',
		'574467bc11fab623418a429d'
	]
};

var myCourse2 = {
	course_number: '15-131',
	course_name: 'Great Practical Ideas for Computer Scientists',
	course_description: `
		Throughout your education as a Computer Scientist at Carnegie Mellon, you will 
		take courses on programming, theoretical ideas, logic, systems, etc. As you progress, 
		you will be expected to pick up the so-called “tools of the trade.” This course is 
		intended to help you learn what you need to know in a friendly, low-stress, high-support 
		way. We will discuss UNIX, LaTeX, debugging and many other essential tools.
	`,
	instructor_name: 'Derek Brown',
	labs: [ 
		'574467bc11091623418a429d',
		'574467bc110as623418a429d',
		'574467bc11fab623418a429d'
	]
};

var myCourse3 = {
	course_number: '15-150',
	course_name: 'Principles of Functional Programming',
	course_description: `
		The purpose of this course is to introduce the theory and practice of functional 
		programming (FP). The characteristic feature of FP is the emphasis on computation 
		as evaluation. The traditional distinction between program and data characteristic of 
		imperative programming (IP) is replaced by an emphasis on classifying expressions by 
		types that specify their applicative behavior. Types include familiar (fixed and arbitrary 
		precision) numeric types, tuples and records (structs), classified values (objects), 
		inductive types such as trees, functions with specified inputs and outputs, and commands 
		such as input and output. Well-typed expressions are evaluated to produce values, 
		in a manner that is guaranteed to be type-safe. Because functional programs do not cause 
		side-effects we can take advantage of simple mathematical principles in reasoning about 
		applicative behavior and analyzing the runtime properties of programs.
	`,
	instructor_name: 'Michael Erdman',
	labs: [ 
		'574467bc11091623418a429d',
		'574467bc110as623418a429d',
		'574467bc11fab623418a429d'
	]
};

var myCourse4 = {
	course_number: '15-251',
	course_name: 'Great Theoretical Ideas in Computer Science',
	course_description: `
		Welcome to 15-251! This course will take a philosophical and historical perspective on 
		the development of theoretical computer science. From using a pile of stones to represent 
		and manipulate numbers, humans have progressively developed an abstract vocabulary with 
		which to mathematically represent their world. The ancients, especially the Greeks, 
		realized that they could consistently reason about their representations in a step-by-step 
		manner. In other words, by computing in abstract models, they could describe and 
		predict patterns in the world around them.
	`,
	instructor_name: 'Bernhard Haeupler',
	labs: [ 
		'574467bc11091623418a429d',
		'574467bc110as623418a429d',
		'574467bc11fab623418a429d'
	]
};

var myCourse5 = {
	course_number: '15-322',
	course_name: 'Introduction to Computer Music',
	course_description: `
		Computers are used to synthesize sound, process signals, and compose music. Personal 
		computers have replaced studios full of sound recording and processing equipment, 
		completing a revolution that began with recording and electronics. In this 
		course, students will learn the fundamentals of digital audio, basic sound 
		synthesis algorithms, and techniques for digital audio effects and processing. 
		Students will apply their knowledge in programming assignments using a very high-level 
		programming language for sound synthesis and composition. In a final project, 
		students will demonstrate their mastery of tools and techniques through a publicly 
		performed music composition.
	`,
	instructor_name: 'Jesse Styles',
	labs: [ 
		'574467bc11091623418a429d',
		'574467bc110as623418a429d',
		'574467bc11fab623418a429d'
	]
};
*/
