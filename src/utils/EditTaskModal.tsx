import { DatePicker, Form, Input, message, Modal, Select } from "antd";
import type { Task } from "../types/tasks.types";
import { useState } from "react";
import dayjs from "dayjs";
import { updateTask } from "../services/taskService";

interface Props {
  open: boolean;
  task: Task;
  onClose: () => void;
  onUpdated: (task: Task) => void;
}

export function EditTaskModal({ open, task, onClose, onUpdated }: Props) {
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
      title="Edit Task"
      onCancel={onClose}
      onOk={onSave}
      confirmLoading={saving}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          type: task.type,
          tags: task.tags,
          dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        }}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select
            options={[
              { value: 'todo' },
              { value: 'in-progress' },
              { value: 'qa' },
              { value: 'done' },
            ]}
          />
        </Form.Item>

        <Form.Item name="priority" label="Priority">
          <Select
            options={[{ value: 'low' }, { value: 'medium' }, { value: 'high' }]}
          />
        </Form.Item>

        <Form.Item name="type" label="Type">
          <Select
            options={[{ value: 'task' }, { value: 'bug' }, { value: 'story' }]}
          />
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select mode="tags" placeholder="Add tags" />
        </Form.Item>

        <Form.Item name="dueDate" label="Due Date">
          <DatePicker className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
