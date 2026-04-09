import React, { useState } from 'react';
import { Button, Checkbox, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { FilterDropdownProps } from 'antd/es/table/interface';

type Option = {
  label: string;
  value: string;
};

type Config = {
  options: Option[];
  width?: number;
  maxHeight?: number;
};

export const getTableFilterDropdown =
  (config: Config) =>
  ({ setSelectedKeys, selectedKeys, confirm }: FilterDropdownProps) => {
    const [searchText, setSearchText] = useState('');

    const filteredOptions = config.options.filter((opt) =>
      opt.label.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
      <div style={{ padding: 8, width: config.width ?? 200 }}>
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
            maxHeight: config.maxHeight ?? 200,
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
            disabled={!selectedKeys || selectedKeys.length === 0}
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
  };
