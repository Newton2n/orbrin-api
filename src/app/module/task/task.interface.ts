export interface ICreateTaskPayload {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
}

export interface IUpdateTaskPayload {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
}

export interface ITaskQueryFilters {
  page?: string;
  limit?: string;
  status?: string;
  priority?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}