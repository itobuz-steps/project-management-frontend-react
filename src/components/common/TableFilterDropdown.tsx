import { Button, Checkbox } from 'antd';

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
  return (
    <div
      style={{
        padding: 8,
        width,
        maxHeight,
        overflowY: maxHeight ? 'auto' : undefined,
      }}
    >
      <Checkbox.Group
        className="flex flex-col gap-2"
        options={options}
        value={selectedKeys as string[]}
        onChange={(values) => {
          setSelectedKeys(values as React.Key[]);
          confirm({ closeDropdown: false });
        }}
      />

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
