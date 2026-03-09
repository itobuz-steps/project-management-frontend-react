import { Button, Form, Input } from 'antd';
import { Send } from 'lucide-react';

interface InviteUserFormProps {
  submitHandler?: (values: { email: string }) => void;
}

export function InviteUserForm({ submitHandler }: InviteUserFormProps) {
  return (
    <Form layout="inline" style={{ paddingBlock: 0 }} onFinish={submitHandler}>
      <Form.Item name="email">
        <Input
          placeholder="Enter email address"
          style={{
            paddingBlock: '4px',
            paddingInline: '8px',
            borderRadius: '4px',
          }}
        />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          className="bg-primary-500 hover:bg-primary-600 rounded-md p-1 text-white"
          style={{
            border: 'none',
            backgroundColor: 'var(--color-primary-500)',
            padding: '2px',
            borderRadius: '4px',
            color: 'white',
            width: '48px',
            height: '30px',
          }}
        >
          <Send className="size-5" />
        </Button>
      </Form.Item>
    </Form>
  );
}
