/**
    COURSE RECORD MODEL
**/

/* Task Model */
export enum TaskStatus {
  Success,
  Failure,
  Skipped,
  In_Progress,
  Not_Attempted
}

interface TaskRecord {
  _id: string;
  status: TaskStatus;
  grade: number;
  data: any;
  attempted: number;
}

/* LabRecord Model */
interface LabRecord {
  lab_id: string;
  data: any;
  attempted: number[];
  tasks: TaskRecord[];
}

/* CourseRecord Model */
export interface CourseRecord {
  user_id: string;
  course_id: string;
  labs: LabRecord[];
}
