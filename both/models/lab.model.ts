/**
  LAB MODEL
**/

  /* TASK MODEL */
  export interface Task {
    id: number;
    name: string;
    md: string;
  }

  /* LAB MODEL */
  export interface Lab {
    _id?: string;
    name: string;
    course_id: string;
    updated?: number;
    hidden?: boolean;
    disabled?: boolean;
    file: string;
    tasks: Task[];
  }
