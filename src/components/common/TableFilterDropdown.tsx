import { Button, Checkbox, Input } from 'antd';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  selectedKeys: React.Key[];
  setSelectedKeys: (keys: React.Key[]) => void;
  confirm: (param?: { closeDropdown?: boolean }) => void;
  width?: number;
  maxHeight?: number;
};

export function TableFilterDropdown({
  options,
  selectedKeys,
  setSelectedKeys,
  confirm,
  width = 200,
  maxHeight,
}: Props) {
  const [searchText, setSearchText] = useState('');

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 8, width }}>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 8 }}
        allowClear
      />

      <div
        style={{
          maxHeight: maxHeight ?? 200,
          overflowY: 'auto',
        }}
      >
        <Checkbox.Group
          className="flex flex-col gap-2"
          options={filteredOptions}
          value={selectedKeys as string[]}
          onChange={(values) => {
            setSelectedKeys(values as React.Key[]);
            confirm({ closeDropdown: false });
          }}
        />
      </div>

      <div className="mt-2 flex justify-end">
        <Button
          size="small"
          type="link"
          disabled={!selectedKeys?.length}
          onClick={() => {
            setSelectedKeys([]);
            confirm({ closeDropdown: false });
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
