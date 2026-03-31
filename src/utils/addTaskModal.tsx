import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  InputNumber,
  Upload,
} from 'antd';
import type { TaskPopulated, User } from '../services/types/tasks.types';
import { useEffect, useState } from 'react';
import { createTask } from '../services/taskService';
import { getUsersByProjectId } from '../services/projectService';
import { useProject } from '../context/ProjectContext';

interface Props {
  open: boolean;
  task: Partial<TaskPopulated>;
  onClose: () => void;
  onCreate: (task: TaskPopulated) => void;
}

export function AddTaskModal({ open, onClose, onCreate }: Props) {
  const { columns, project, addTask } = useProject();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  useEffect(() => {
    if (!open || !project?._id) {
      setMembers([]);
      return;
    }

    console.log('Fetching project members...');

    getUsersByProjectId(project._id)
      .then((data) => {
        console.log({ data });
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
      console.log({ values });
      if (!project?._id) {
        message.error('Select a project before creating a task.');
        return;
      }
      setSaving(true);

      const attachments = values.attachments?.fileList.map(
        (fileObj: { originFileObj: File }) => {
          return fileObj.originFileObj;
        }
      );
      console.log(attachments);

      const created = await createTask({
        ...values,
        projectId: project._id,
        priority: String(values.priority).toLowerCase(),
        type: String(values.type).toLowerCase(),
        dueDate: values.dueDate?.toISOString(),
        assignee: values.assignee || null,
        attachments,
      });

      message.success('Task created');
      addTask(created);
      onCreate(created);
      form.resetFields();
      onClose();
    } catch (err) {
      console.error(err);
      message.error('Failed to create task. Please try again.');
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
      width={600}
      styles={{
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'none',
        },
      }}
      className="sm:w-full sm:max-w-lg"
    >
      <Form
        form={form}
        layout="vertical"
        styles={{
          label: {
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-primary-500)',
          },
        }}
        initialValues={{
          type: 'task',
          priority: 'medium',
          status: columns?.[0],
          storyPoint: 0,
        }}
        className="gap-2"
      >
        {/* Title + Story Point */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true }]}
            style={
              project?.projectType !== 'scrum' ? { gridColumn: 'span 3' } : {}
            }
            className="sm:col-span-2"
          >
            <Input
              className="focus:border-primary-500 focus:ring-primary-500"
              placeholder="e.g. Create task modal"
            />
          </Form.Item>

          {project?.projectType !== 'kanban' && (
            <Form.Item name="storyPoint" label="Story Point">
              <InputNumber
                min={0}
                defaultValue={1}
                className="focus:border-primary-500 focus:ring-primary-500"
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
        </div>

        {/* Description */}
        <Form.Item name="description" label="Description">
          <Input.TextArea
            rows={3}
            placeholder="e.g. Editing create task modal"
            className="focus:border-primary-500 focus:ring-primary-500"
          />
        </Form.Item>

        {/* Type / Priority / Status */}
        <div className="grid grid-cols-3 gap-2">
          <Form.Item name="type" label="Type">
            <Select
              className="focus:border-primary-500 focus:ring-primary-500"
              options={[
                { value: 'bug', label: 'Bug' },
                { value: 'task', label: 'Task' },
                { value: 'story', label: 'Story' },
                { value: 'epic', label: 'Epic' },
              ]}
            />
          </Form.Item>

          <Form.Item name="priority" label="Priority">
            <Select
              className="focus:border-primary-500 focus:ring-primary-500"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              className="focus:border-primary-500 focus:ring-primary-500"
              options={columns.map((col) => ({
                label: col,
                value: col,
              }))}
            />
          </Form.Item>
        </div>

        {/* Tags/  Due Date / Assignee */}
        <div className="grid grid-cols-3 gap-2">
          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              placeholder="Add tags"
              className="focus:border-primary-500 focus:ring-primary-500"
            />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker
              className="focus:border-primary-500 focus:ring-primary-500"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="assignee" label="Assignee">
            <Select
              placeholder="Select assignee"
              allowClear
              className="focus:border-primary-500 focus:ring-primary-500"
              style={{ width: '100%' }}
              options={members.map((member) => ({
                value: member._id,
                label: member.name || member.email,
              }))}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* File Upload */}
          <Form.Item name="attachments" label="Attachments">
            <Upload
              multiple
              maxCount={5}
              beforeUpload={() => false}
              listType="text"
              style={{ width: '200%' }}
            >
              <button
                type="button"
                className="hover:border-primary-500 rounded-md border border-dashed border-gray-300 px-4 py-2 transition-colors"
                style={{ width: '100%' }}
              >
                Click to upload files (max 5)
              </button>
            </Upload>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
