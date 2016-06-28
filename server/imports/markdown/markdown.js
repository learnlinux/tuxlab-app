/* TuxLab - markdown.js */

// Import marked 
	var marked = require('marked');
	
// Define Course Collection
	Tasks = new Mongo.Collection('Tasks');
	
	console.log('hey');
	
	
	var testString = 
	'# tuxlab-assets \n' + 
	'TuxLab is an open source platform for creating Interactive Linux Courses. ' +
	'This repository contains the assets for the Logo, Icons, Fonts and Design for TuxLab application. \n' +  
	'If you are instead looking for the application source code itself, visit the ' + 
	'[App Repository](https://github.com/learnlinux/tuxlab-app).\n' +
	'# FUN THINGS \n' +
	'## Logo \n' +
	'The TuxLab logo is licensed under Creative Commons 3.0 with Attribution. \n ' +
	'## Colors \n' +
	'## User Interface \n ' +
	'The TuxLab interface is developed entirely using ' +
	'[Angular 2 Material](https://github.com/angular/material2).' +  
	'You should follow [Google\'s Material Style guide]' +
	'(https://www.google.com/design/spec/material-design/introduction.html) ' +
	'whenever you are designing a component of the TuxLab project- be it an icon, UX ' +
	'item, or presentation. \n' +
	'## Fonts \n' + 
	'* [Open Sans](https://github.com/google/fonts/tree/master/apache/opensans)' +
	' - it is licensed under the Apache 2.0 license.';
	
// Sample tasks to insert
	var Task1 = {
		task_name: 'Task Name',
		task_markdown: marked(testString)
	};
	// Tasks.insert(Task1);
	
// Publish tasks to client
	Meteor.publish('markdown', function() {
		// Notify that cursor is publishing
		console.log("Publishing html string.");
		// Publish all tasks
		return Tasks.find();
	});
