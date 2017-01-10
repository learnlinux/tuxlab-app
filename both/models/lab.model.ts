/**
  LAB MODEL
**/

  /*
    LAB STATUS
  */
  export enum LabStatus{
    hidden, //
    secret, //
    private, //
    public //
  }

  /* LAB MODEL */
  export interface Lab {
    _id?: string;
    name: string;
    course_id: string;
    updated: number;
    status: LabStatus
    file: string;
    tasks: Task[];
  }

  /* TASK MODEL */
  export interface Task {
    id: number;
    name: string;
    md: string;
  }
