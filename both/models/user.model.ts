/**
  USER MODEL
**/

 // Import Meteor User
 import { Meteor } from 'meteor/meteor';

  /* PROFILE MODEL */
  export interface Profile {
    name: string;
    organization: string;
    picture?: string;
  }

  /* ROLE MODEL */
  export enum Role {
    guest = 0,
    student = 1,
    instructor = 2,
    course_admin = 3,
    global_admin = 4
  }
  export interface Privilege {
    course_id: string;
    role: Role;
  }

  /* USER MODEL */
  export interface User extends Meteor.User {
    _id? : string;
    username: string;
    profile: Profile;
    global_admin: boolean;
    roles: Privilege[];
  }
