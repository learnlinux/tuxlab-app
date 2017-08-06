/**
  COURSE RECORD MODEL
**/

/* Task Model */
export enum TaskStatus {
  success = 0,
  failure = 1,
  skipped = 2,
  in_progress = 3,
  not_attempted = 4,
  error = 5
}

interface TaskRecord {
  status: TaskStatus;
  grade?: number[];
  data?: any[];
}

/* Session Record */
interface SessionRecord {
  data?: any;
  tasks: TaskRecord[];
}

/* LabRecord Model */
interface LabRecord {
  [session_id : string] : SessionRecord;
}

export interface LabRecords {
  [lab_id : string] : LabRecord;
}

/* CourseRecord Model */
export interface CourseRecord {
  _id?: string;
  user_id: string;
  course_id: string;
  labs: LabRecords;
}
