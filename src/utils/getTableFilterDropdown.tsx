import React from 'react';
import { Button, Checkbox } from 'antd';
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
    return (
      <div
        style={{
          padding: 8,
          width: config.width ?? 200,
          maxHeight: config.maxHeight ?? 250,
          overflowY: 'auto',
        }}
      >
        <Checkbox.Group
          className="flex flex-col gap-2"
          options={config.options}
          value={selectedKeys as string[]}
          onChange={(values) => {
            setSelectedKeys(values as React.Key[]);
            confirm({ closeDropdown: false }); // instant apply
          }}
        />

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
