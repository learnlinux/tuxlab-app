// Meteor Imports
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
// Angular Imports
  import { Component } from '@angular/core';
  
// Angular Meteor Imports
  import { MeteorComponent } from 'angular2-meteor';
  
// Define UserList Component
@Component({
  selector: 'tuxlab-userlist',
  templateUrl: '/client/imports/ui/pages/course/userlist.html',
  directives: []
})

export class UserList extends MeteorComponent {
  students: Array<Object>;
  constructor() {
    super();
    this.students = [
      { id: 1, nickname: "sandershihacker", first_name: "Sander", last_name: "Shi" },
      { id: 2, nickname: "derekbro", first_name: "Derek", last_name: "Brown" },
      { id: 3, nickname: "amortenson", first_name: "Aaron", last_name: "Mortenson" },
      { id: 4, nickname: "cersoz", first_name: "Cem", last_name: "Ersoz" },
    ];
  }
}