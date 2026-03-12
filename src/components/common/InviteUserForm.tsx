import { Button, Form, Select } from 'antd';
import { Send } from 'lucide-react';

interface InviteUserFormProps {
  submitHandler?: (values: { email: string }) => void;
  onCancel?: () => void;
}

export function InviteUserForm({ submitHandler }: InviteUserFormProps) {
  return (
    <Form
      layout="inline"
      style={{ paddingBlock: 0, display: 'flex', width: '100%' }}
      onFinish={submitHandler}
    >
      <Form.Item name="email" style={{ flex: 1, minWidth: 0 }}>
        <Select
          mode="tags"
          placeholder="Enter email address"
          style={{
            paddingBlock: '4px',
            paddingInline: '8px',
            borderRadius: '4px',
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          className="bg-primary-500 hover:bg-primary-600 rounded-md p-1 text-white"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            backgroundColor: 'var(--color-primary-500)',
            padding: '6px',
            borderRadius: '6px',
            color: 'white',
            width: '40px',
            height: '36px',
          }}
        >
          <Send className="align-center flex size-5 justify-center" />
        </Button>
      </Form.Item>
    </Form>
  );
}
