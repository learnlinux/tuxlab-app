/**
  LAB MODEL
**/

  /* TASK MODEL */
  export interface TaskModel {
    _id: string;
    updated: number;
    name: string;
    md: string;
  }

  /* LAB MODEL */
  export interface Lab {
    _id: string;
    lab_name:string;
    course_id: string;
    updated: number;
    hidden: boolean;
    disabled: boolean;
    file: string;
    tasks: TaskModel[];
  }
