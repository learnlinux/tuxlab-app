/**
  USER MODEL
**/

  /* PROFILE MODEL */
  interface Profile {
    first_name: string;
    last_name: string;
    nickname: string;
    school: string;
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

  /* SESSION MODEL */
  interface Session {
    lab_id: string;
    started: number;
  }

  /* SERVICES MODEL */
  interface Services {
    facebook?: any;
    google?: any;
  }

  /* USER MODEL */
  export interface User {
    _id: string;
    services: Services;
    profile: Profile;
    roles: Roles;
    sessions:Session[];
  }
