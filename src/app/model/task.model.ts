export enum TaskStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending'
}
export interface TaskModel {
  id?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
}
