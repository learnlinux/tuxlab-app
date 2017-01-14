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
  export enum Role {
    student = 1,
    instructor = 2,
    course_administrator = 3,
    global_admin = 4
  }
  export interface Privilege {
    course_id: string;
    course_record: string;
    role: Role
  }

  /* USER MODEL */
  export interface User extends Meteor.User {
    profile: Profile;
    global_admin: boolean,
    roles: Privilege[];
  }
