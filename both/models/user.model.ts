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
  interface Roles {
    administrator: string[];
    instructor: string[];
    student: string[];
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
