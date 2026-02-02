import type { TemplateCategory } from './createProject.types';

export const templateCategories: TemplateCategory[] = [
  {
    id: 'software-development',
    name: 'Software Development',
    templates: [
      {
        id: 'project-management',
        name: 'Project Management',
        columns: ['To Do', 'In Progress', 'Done'],
      },
      {
        id: 'bug-tracking',
        name: 'Bug tracking',
        columns: ['To Do', 'In Progress', 'In Review', 'Done'],
      },
    ],
  },
  {
    id: 'service-management',
    name: 'Service management',
    templates: [
      {
        id: 'it-service',
        name: 'IT Service Desk',
        columns: ['Open', 'In Progress', 'Waiting', 'Resolved', 'Closed'],
      },
      {
        id: 'customer-support',
        name: 'Customer Support',
        columns: ['New', 'In Progress', 'Pending', 'Resolved'],
      },
    ],
  },
  {
    id: 'work-management',
    name: 'Work management',
    templates: [
      {
        id: 'general-tasks',
        name: 'General Tasks',
        columns: ['Backlog', 'To Do', 'In Progress', 'Done'],
      },
      {
        id: 'marketing-campaign',
        name: 'Marketing Campaign',
        columns: ['Ideas', 'Planning', 'In Progress', 'Review', 'Published'],
      },
    ],
  },
];
