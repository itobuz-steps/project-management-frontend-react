import { useState } from 'react';
import { Button, Form, Select } from 'antd';
import { Send } from 'lucide-react';
import { LoadingOutlined } from '@ant-design/icons';

interface InviteUserFormProps {
  submitHandler?: (values: { email: string[] }) => Promise<void>;
  onCancel?: () => void;
}

export function InviteUserForm({ submitHandler }: InviteUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values: { email: string[] }) => {
    if (!submitHandler) return;
    try {
      setLoading(true);
      await submitHandler(values);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="inline"
      style={{
        paddingBlock: 0,
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
      }}
      onFinish={handleFinish}
    >
      <Form.Item
        name="email"
        style={{ minWidth: 0, flex: 1 }}
        rules={[
          {
            validator: (_, value: string[]) => {
              if (!value || value.length === 0)
                return Promise.reject('Please enter at least one email.');

              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const invalid = value.filter((v) => !emailRegex.test(v));

              return invalid.length > 0
                ? Promise.reject(`Invalid email(s): ${invalid.join(', ')}`)
                : Promise.resolve();
            },
          },
        ]}
      >
        <Select
          mode="tags"
          open={false}
          suffixIcon={null}
          placeholder="Type an email and press Enter"
          tokenSeparators={[',', ' ']}
          disabled={loading}
          maxTagCount="responsive"
          style={{
            paddingInline: '8px',
            borderRadius: '4px',
            width: '100%',
            height: '36px',
          }}
        />
      </Form.Item>

      <Form.Item>
        <Button
          htmlType="submit"
          loading={false} // we control the icon manually
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            backgroundColor: loading
              ? 'var(--color-primary-300)'
              : 'var(--color-primary-500)',
            padding: '6px',
            borderRadius: '4px',
            color: 'white',
            width: '40px',
            height: '36px',
            transition: 'background-color 0.2s',
          }}
        >
          {loading ? (
            <LoadingOutlined className="size-5" spin />
          ) : (
            <Send className="size-5" />
          )}
        </Button>
      </Form.Item>
    </Form>
  );
}
