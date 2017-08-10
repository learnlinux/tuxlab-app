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
    name: string;
    md: string;
  }

  /* LAB FILE IMPORT OPTS */
  export interface LabFileImportOpts{
    _id?: string;
    course_id: string;
    file: string;
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
