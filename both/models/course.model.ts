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
    meta: boolean;
    content: ContentPermissions;
    enroll: EnrollPermissions;
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
    instructors: User[];
    administrators: User[];
    permissions: Permissions;
    labs: string[];
  }
