import { Button, Form, InputNumber } from 'antd';
import type { Sprint } from '../../services/types/sprints.types';
import { SprintButton } from './SprintButton';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

interface CreateSprintFormProps {
  sprint?: Sprint | null;
  createSprintHandler: (storyPoint: number) => void;
}

export function CreateSprintForm({
  sprint,
  createSprintHandler,
}: CreateSprintFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {!sprint && !showForm && (
        <SprintButton onClick={() => setShowForm(true)}>
          Create Sprint
        </SprintButton>
      )}

      {showForm && (
        <Form
          onFinish={(values) => {
            createSprintHandler(values.storyPoint);
            setShowForm(false);
          }}
          onFinishFailed={() => {
            toast.error('Please enter a valid integer for story points');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <div className="flex items-center gap-4">
            <X
              className="-mr-2 size-4 cursor-pointer"
              onClick={() => setShowForm(false)}
            />
            <Form.Item
              name={'storyPoint'}
              rules={[
                {
                  type: 'number',
                  min: 0,
                  message: '',
                },
                { required: true, message: '' },
              ]}
              style={{ margin: 0 }}
            >
              <InputNumber
                min={0}
                type="number"
                placeholder="Story Points"
                style={{ width: '120px' }}
              />
            </Form.Item>{' '}
          </div>

          <Form.Item style={{ margin: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                borderRadius: 'var(--radius-sm)',
                backgroundColor: hovered
                  ? 'var(--color-primary-500)'
                  : 'var(--color-primary-400)',
                paddingBlock: '0.125rem',
                paddingInline: '0.5rem',
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}
