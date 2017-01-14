/**
  USER MODEL
**/

 // Import Meteor User
 import { Meteor } from 'meteor/meteor';

  /* PROFILE MODEL */
  export interface Profile {
    name: string;
    organization: string;
    email: string;
    picture?: string;
  }

  /* ROLE MODEL */
  export interface Role {
    course_id: string;
    course_record: string;
  }

  interface Roles {
    global_admin : boolean
    administrator: Role[];
    instructor: Role[];
    student: Role[];
  }

  /* USER MODEL */
  export interface User extends Meteor.User {
    profile: Profile;
    roles: Roles;
  }
