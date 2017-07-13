/**
  LAB MODEL
**/

  /*
    LAB STATUS
  */
  export enum LabStatus{
    hidden, // Visible only to Admins and Instructors
    open, // Users can begin
    closed // Users cannot begin
  }

  /* TASK MODEL */
  export interface Task {
    id: number;
    name: string;
    md: string;
  }


  /* LAB MODEL */
  export interface Lab {
    _id?: string;
    name?: string;
    description?: string;
    course_id: string;
    updated: number;
    status: LabStatus
    file: string;
    tasks: Task[];
  }
