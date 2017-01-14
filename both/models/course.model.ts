/**
  COURSE MODEL
**/

  /* COURSE DESCRIPTION */
  interface CourseDescription {
    content: string;
    syllabus: string;
  }

  /* PERMISSIONS */
  interface Permissions {
    meta: boolean; // Is the course visible in searches and explore views?
    content: ContentPermissions; // Who can view content from this course?
    enroll: EnrollPermissions;   // Who is allowed to enroll in the course?
  }

  export enum ContentPermissions {
    Any,
    Auth,
    None
  }

  export enum EnrollPermissions {
    Any,
    None
  }

  /* User */
  interface User {
    _id: string;
    name: string;
  }

  /* COURSE MODEL */
  export interface Course {
    _id: string;
    course_name: string;
    course_number?: string;
    course_description?: CourseDescription;
    featured: boolean;
    labs: string[];
    administrators: User[];
    instructors: User[];
    permissions: Permissions;
  }
