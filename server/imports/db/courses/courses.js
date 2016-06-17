// Courses = new Meteor.Collection('Courses');
/* Create Courses database schema */
courseSchema = new SimpleSchema({
    course_name: {
        type: String,
        label: "Course Name"
    },
    course_number: {
        type: String,
        label: "Course Number"
    },
    course_description: {
        type: String, 
        defaultValue: "",
        label: "Course Description"
    },
    course_openInfo: {
        type: [String],
        label: "Customizable Course Information"
    }
});

/* This function adds the passed in course to the collection if valid */
function addCourse(newCourse) {
    try {
        courseSchema.validate(newCourse);
        Courses.insert(newCourse);
        console.log("Inserted one course.");
    }
    catch(err) {
        console.log("The format of the course is wrong!");
    } 
}

/* Insert Course example */
/*
const myCourse = {
    course_name: 'Great Practical Ideas for Computer Scientists',
    course_number: "15-131",
    course_description: 'This course focuses on teaching students how to use the popular tools for software development.',
    course_openInfo: ["Homework:", "hw1", "Labs", "lab1"]
};
addCourse(myCourse);
*/

/* Functions to get course data when given id */
function getCourse(id) {
    if (Courses.find({_id: id}).count() != 1) {
        throw "ERROR";
    }
    return Courses.findOne({_id: id});
}

function getCourseName(id) {
    return getCourse(id).course_name;
}

function getCourseNumber(id) {
    return getCourse(id).course_number;
}

function getCourseDescription(id) {
    return getCourse(id).course_description;
}

function getCourseOpenInfo(id) {
    return getCourse(id).course_openInfo;
}