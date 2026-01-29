import {EditOutlined} from "@ant-design/icons";
import { useState } from "react";
import type { TaskPopulated } from "../../services/types/tasks.types";
import { Button, Tag } from "antd";
import { SidebarRow } from "./SidebarRow";
import { UserCell } from "../../utils/UserCell";
import { EditTaskModal } from "../../utils/EditTaskModal";

export function TaskSidebar({
  task,
  onUpdated,
}: {
  task: TaskPopulated;
  onUpdated: (t: TaskPopulated) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        {/* EDIT BUTTON */}
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold">Task Details</h3>
          <Button
            icon={<EditOutlined />}
            // block={isMobile}
            onClick={() => setEditOpen(true)}
          ></Button>
        </div>
        {/* <Button
          size="small"
          type="text"
          icon={<EditOutlined />}
          className="absolute top-2 right-2 opacity-0 transition group-hover:opacity-100 bg-red-900"
          onClick={() => setEditOpen(true)}
        /> */}
        <div className="space-y-3">
          <SidebarRow label="Status">
            <Tag>{task.status}</Tag>
          </SidebarRow>

          <SidebarRow label="Assignee">
            <UserCell user={task.assignee} emptyText="Unassigned" />
          </SidebarRow>

          <SidebarRow label="Priority">
            <Tag color={task.priority === 'high' ? 'red' : 'gold'}>
              {task.priority}
            </Tag>
          </SidebarRow>

          <SidebarRow label="Type">
            <Tag color="geekblue">{task.type}</Tag>
          </SidebarRow>

          <SidebarRow label="Story Points">{task.storyPoint ?? '—'}</SidebarRow>

          <SidebarRow label="Due Date">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
          </SidebarRow>

          <SidebarRow label="Reporter">
            <UserCell user={task.reporter} emptyText="—" />
          </SidebarRow>
        </div>
      </div>
      <EditTaskModal
        open={editOpen}
        task={task}
        onClose={() => setEditOpen(false)}
        onUpdated={onUpdated}
      />
    </>
  );
}
