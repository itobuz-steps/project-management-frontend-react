import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  InputNumber,
} from 'antd';
import type { TaskPopulated } from '../services/types/tasks.types';
import { useState } from 'react';
import dayjs from 'dayjs';
import { updateTask } from '../services/taskService';
import { useProject } from '../context/ProjectContext';

interface Props {
  open: boolean;
  task: TaskPopulated;
  onClose: () => void;
  onUpdated: (task: TaskPopulated) => void;
}

export function EditTaskModal({ open, task, onClose, onUpdated }: Props) {
  const { columns } = useProject();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const updated = await updateTask(task._id, {
        ...values,
        dueDate: values.dueDate?.toISOString(),
      });

      message.success('Task updated');
      onUpdated(updated);
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
      title="Update Task"
      onCancel={onClose}
      onOk={onSave}
      confirmLoading={saving}
      destroyOnHidden
      width={700}
      styles={{
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'none',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: task.title,
          description: task.description,
          storyPoint: task.storyPoint,
          type: task.type,
          priority: task.priority,
          status: task.status,
          tags: task.tags,
          assignee: task.assignee,
          dueDate: task.dueDate ? dayjs(task.dueDate) : null,
          // blocks: task.blocks,
          // blockedBy: task.blockedBy,
          // relatedTo: task.relatedTo,
        }}
      >
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
            <Select placeholder="Select assignee" />
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
