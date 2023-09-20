export const createTaskAdapter = (task: any) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status:task.status
});

export const createTasksAdapter = (data: any) => (data.map((row:any) => createTaskAdapter(row)));
