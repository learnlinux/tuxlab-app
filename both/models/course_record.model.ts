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
  grade: number[];
  data?: any[];
  attempted: number[];
}

/* LabRecord Model */
interface LabRecord {
  data?: any;
  attempted: number[];
  tasks: TaskRecord[];
}

interface LabRecords {
  [lab_id : string] : LabRecord;
}

/* CourseRecord Model */
export interface CourseRecord {
  _id?: string;
  user_id: string;
  course_id: string;
  labs: LabRecords;
}
