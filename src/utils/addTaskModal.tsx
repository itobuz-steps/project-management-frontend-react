import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  InputNumber,
} from 'antd';
import type { Task, User } from '../services/types/tasks.types';
import { useEffect, useState } from 'react';
import { createTask } from '../services/taskService';
import { getUsersByProjectId } from '../services/projectService';
import { useProject } from '../context/ProjectContext';

interface Props {
  open: boolean;
  task: Partial<Task>;
  onClose: () => void;
  onCreate: (task: Task) => void;
}

export function AddTaskModal({ open, onClose, onCreate }: Props) {
  const { columns, project } = useProject();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  useEffect(() => {
    if (!open || !project?._id) {
      setMembers([]);
      return;
    }

    getUsersByProjectId(project._id)
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : (data as { result?: User[] })?.result || [];
        setMembers(list);
      })
      .catch(() => {
        message.error('Failed to load project members.');
        setMembers([]);
      });
  }, [open, project?._id]);

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      if (!project?._id) {
        message.error('Select a project before creating a task.');
        return;
      }
      setSaving(true);

      const created = await createTask({
        ...values,
        projectId: project._id,
        priority: String(values.priority).toLowerCase(),
        type: String(values.type).toLowerCase(),
        dueDate: values.dueDate?.toISOString(),
        assignee: values.assignee || undefined,
      });

      message.success('Task created');
      onCreate(created);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Create Task"
      onCancel={onClose}
      onOk={onSave}
      okButtonProps={{ style: { backgroundColor: 'var(--color-primary-500)' } }}
      confirmLoading={saving}
      destroyOnHidden
      width={700}
    >
      <Form form={form} layout="vertical">
        {/* Title + Story Point */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true }]}
            className="col-span-2"
          >
            <Input />
          </Form.Item>

          <Form.Item name="storyPoint" label="Story Point">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* Type / Priority / Status */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item name="type" label="Type">
            <Select
              options={[
                { value: 'Bug', label: 'Bug' },
                { value: 'Task', label: 'Task' },
                { value: 'Story', label: 'Story' },
              ]}
            />
          </Form.Item>

          <Form.Item name="priority" label="Priority">
            <Select
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Critical', label: 'Critical' },
              ]}
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              options={columns.map((col) => ({
                label: col,
                value: col,
              }))}
            />
          </Form.Item>
        </div>

        {/* Tags / Due Date / Assignee */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Add tags" />
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date">
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="assignee" label="Assignee">
            <Select
              placeholder="Select assignee"
              allowClear
              options={members.map((member) => ({
                value: member._id,
                label: member.name || member.email,
              }))}
            />
          </Form.Item>
        </div>

        {/* <div className="grid grid-cols-3 gap-4">
          <Form.Item name="blocks" label="Blocks">
            <Select mode="multiple" placeholder="Select tasks" />
          </Form.Item>

          <Form.Item name="blockedBy" label="Blocked by Issue">
            <Select mode="multiple" placeholder="Select issues" />
          </Form.Item>

          <Form.Item name="relatedTo" label="Related To">
            <Select mode="multiple" placeholder="Select tasks" />
          </Form.Item>
        </div> */}
      </Form>
    </Modal>
  );
}
