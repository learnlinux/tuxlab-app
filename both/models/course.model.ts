/**
  COURSE MODEL
**/

  import { User, Role } from './user.model';

  /* COURSE DESCRIPTION */
  interface CourseDescription {
    content: string; // Markdown Not Supported
    syllabus: string; // Markdown Supported
  }

  /* PERMISSIONS */
  export interface Permissions {
    meta: boolean; // Is the course visible in searches and explore views?
    content: ContentPermissions; // Who can view content from this course?
    enroll: EnrollPermissions;   // Who is allowed to enroll in the course?
  }

  export enum ContentPermissions {
    Any, // Anyone in the Domain
    Auth, // Members of the Course
    None
  }

  export enum EnrollPermissions {
    Any,
    None
  }

  /* COURSE MODEL */
  export interface Course {
    _id?: string;
    name: string;
    course_number?: string;
    description?: CourseDescription;
    featured: boolean;
    labs: string[];
    instructors: string[];
    permissions: Permissions;
  }
