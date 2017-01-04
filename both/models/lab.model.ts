/**
  LAB MODEL
**/

  /* LAB MODEL */
  export interface LabModel {
    _id?: string;
    name: string;
    course_id: string;
    updated?: number;
    hidden?: boolean;
    disabled?: boolean;
    file: string;
    tasks: Task[];
  }

  /* TASK MODEL */
  export interface TaskModel {
    id: number;
    name: string;
    md: string;
  }
