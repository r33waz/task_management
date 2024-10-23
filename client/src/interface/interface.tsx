export interface TaskInterface {
    id: number;
    title: string;
    description: string;
    file: string | null;
    userid: number;
    created_at: string;
    due_date: string;
    status: string;
    task_id: number;
  }
  