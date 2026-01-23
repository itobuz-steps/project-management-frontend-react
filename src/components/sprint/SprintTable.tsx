import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Sprint } from '../../types/sprint.types';
import type { Task } from '../../types/tasks.types';

interface SprintTableProps {
  sprint: Sprint;
  tasks: Task[];
}

export function SprintTable({ sprint, tasks }: SprintTableProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      {/* Sprint Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-t-lg bg-gray-50 px-4 py-2 text-left hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={`h-4 w-4 transition ${open ? '' : '-rotate-90'}`}
          />
          <span className="font-semibold">{sprint.key}</span>

          {sprint.dueDate && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              Due {new Date(sprint.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="space-x-4">
          <span className="text-xs text-gray-400">
            {tasks.length} issue{tasks.length !== 1 && 's'}
          </span>
          {/* 
          <button
            type="button"
            id={`${sprint.key}-sprint-start-button`}
            className="bg-primary-400 hover:bg-primary-500 cursor-pointer rounded-sm px-2 py-1 font-medium text-white shadow-xs focus:outline-none"
          >
            Start Sprint
          </button> */}
        </div>
      </button>

      {/* Sprint Table */}
      {open && (
        <div className="no-scrollbar relative mt-2 w-full overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="sticky top-0 z-10 border-b bg-gray-100 text-xs text-gray-600 uppercase">
              <tr>
                <th scope="col" className="p-2 text-center">
                  Type
                </th>
                <th scope="col" className="p-2">
                  Key
                </th>
                <th scope="col" className="p-2 px-6">
                  Summary
                </th>
                <th scope="col" className="p-2 px-6">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Sprint
                </th>
                <th scope="col" className="p-2 px-6">
                  Assignee
                </th>
                <th scope="col" className="p-2 px-6">
                  Due Date
                </th>
                <th scope="col" className="p-2 px-6">
                  Labels
                </th>
                <th scope="col" className="p-2 px-6">
                  Created
                </th>
                <th scope="col" className="p-2 px-6">
                  Updated
                </th>
                <th scope="col" className="p-2 px-6">
                  Reporter
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="py-10 text-center text-sm text-gray-400"
                  >
                    Drop tasks here…
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="p-2 text-center whitespace-nowrap">
                      <span className="rounded bg-gray-200 px-2 py-0.5 text-xs">
                        {task.type ?? 'Task'}
                      </span>
                    </td>

                    <td className="p-2 font-medium whitespace-nowrap text-blue-600">
                      {task.key}
                    </td>

                    <td className="p-2 px-6 whitespace-nowrap">{task.title}</td>

                    <td className="p-2 px-6 whitespace-nowrap">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                        {task.status}
                      </span>
                    </td>

                    <td className="p-2 px-6 whitespace-nowrap">{sprint.key}</td>

                    <td className="p-2 px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="mr-3 aspect-square h-6 w-6 rounded-full object-cover"
                          src={`${task.assignee?.profileImage}`}
                        />
                        {task.assignee?.name ?? 'Unassigned'}
                      </div>
                    </td>

                    <td className="p-2 px-6 whitespace-nowrap">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="p-2 px-6 whitespace-nowrap">
                      <div className="flex gap-1">
                        {task.labels?.length
                          ? task.labels.map((label) => (
                              <span
                                key={label}
                                className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                              >
                                {label}
                              </span>
                            ))
                          : '—'}
                      </div>
                    </td>

                    <td className="p-2 px-6 text-xs whitespace-nowrap text-gray-500">
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : ''}
                    </td>

                    <td className="p-2 px-6 text-xs whitespace-nowrap text-gray-500">
                      {task.updatedAt
                        ? new Date(task.updatedAt).toLocaleDateString()
                        : ''}
                    </td>

                    <td className="p-2 px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="mr-3 aspect-square h-6 w-6 rounded-full object-cover"
                          src={`${task.reporter?.profileImage}
                            ? config.API_BASE_URL + '/uploads/profile/' + task.reporter.avatarUrl
                            : '../../../assets/img/profile.png'}`}
                        />
                        {task.reporter?.name ?? 'Unknown'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
