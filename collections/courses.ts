import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export let Courses = new Mongo.Collection('courses');

var myCourse = {
  course_number: '15-131',
  course_name: 'Great Practical Ideas for Computer Scientists',
  course_description: `
    Throughout your education as a Computer Scientist at Carnegie Mellon, 
    you will take courses on programming, theoretical ideas, logic, systems, etc. 
    As you progress, you will be expected to pick up the so-called 
    “tools of the trade.” This course is intended to help you learn what you need 
    to know in a friendly, low-stress, high-support way. We will discuss UNIX, 
    LaTeX, debugging and many other essential tools.
  `,
  labs: [
    {
      _id: 1,
      lab_name: 'Getting Started with Git',
      file: '#############################',
      tasks: [
        {
          _id: 1,
          name: 'Git Clone',
          md: '############'
        },
        {
          _id: 2,
          name: 'Git Pull',
          md: '############'
        }
      ]
    },
    {
      _id: 2,
      lab_name: 'Advanced Git 1',
      file: '#############################',
      tasks: [
        {
          _id: 1,
          name: 'Git Submodules',
          md: '############'
        }
      ]
    }
  ]
};

var myCourse1 = {
  course_number: '15-251',
  course_name: 'Great Theoretical Ideas in Computer Science',
  course_description: `
    Welcome to 15-251! This course will take a philosophical and historical perspective 
    on the development of theoretical computer science. From using a pile of stones to 
    represent and manipulate numbers, humans have progressively developed an abstract 
    vocabulary with which to mathematically represent their world. The ancients, 
    especially the Greeks, realized that they could consistently reason about their 
    representations in a step-by-step manner. In other words, by computing in abstract 
    models, they could describe and predict patterns in the world around them.
  `,
  labs: [
    {
      _id: 1,
      lab_name: 'Getting Started with Git',
      file: '#############################',
      tasks: [
        {
          _id: 1,
          name: 'Git Clone',
          md: '############'
        },
        {
          _id: 2,
          name: 'Git Pull',
          md: '############'
        }
      ]
    },
    {
      _id: 2,
      lab_name: 'Advanced Git 1',
      file: '#############################',
      tasks: [
        {
          _id: 1,
          name: 'Git Submodules',
          md: '############'
        }
      ]
    }
  ]
};

if(Meteor.isServer) {
  if(Courses.find().count() === 0) {
    Courses.insert(myCourse);
    Courses.insert(myCourse1);
  }
  Meteor.publish('courses', function() {
    return Courses.find();
  });
}

/* 
export let Courses = new Mongo.Collection('courses');
 
Courses.allow({
  insert: function (userId, doc) {
    let user = Meteor.user().profile;
    if (typeof user !== 'undefined') {
      if (typeof user.roles !== 'undefined') {  
        if (typeof user.roles.administrator !== 'undefined') {
          return user.roles.administrator.indexOf('global') >= 0;
        }
      }
    }
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    let user = Meteor.user().profile
    if ((typeof user !== 'undefined') && (typeof user.roles !== 'undefined')) {
      return (
        (
          typeof user.roles.administrator !== 'undefined'
        ) &&
        (
          (
            user.roles.administrator.indexOf('global') >= 0
          ) ||
          (
            typeof doc._id !== 'undefined' && 
            user.roles.administrator.indexOf(doc._id) >= 0
          )
        )
      ) ||
      (
        (
          typeof user.roles.instructor !== 'undefined'
        ) &&
        (
          (
            user.roles.instructor.indexOf('global') >= 0
          ) ||
          (
            typeof doc._id !== 'undefined' && 
            user.roles.instructor.indexOf(doc._id) >= 0
          )
        )
      );
    }
    return false;
  },
  remove: function(userId, doc) {
    let user = Meteor.user().profile
    if (typeof user !== 'undefined') {
      if (typeof user.roles !== 'undefined') {  
        if (typeof user.roles.administrator !== 'undefined') {
          return (user.roles.administrator.indexOf('global') >= 0 ||
                  (typeof doc._id !== 'undefined' && 
                   user.roles.administrator.indexOf(doc._id) >= 0));
        }
      }
    }
    return false;
  }
});
*/