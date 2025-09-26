export interface Organization {
  id: string;
  name: string;
  slug: string;
  contact_email: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON-HOLD';
  due_date?: string;
  taskCount: number;
  completedTasks: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignee_email: string;
  due_date?: string;
}

export interface Comment {
  id: string;
  content: string;
  author_email: string;
  timestamp: string;
}
