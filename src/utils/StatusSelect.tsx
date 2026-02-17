import { Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export function StatusSelect({
  value,
  columns,
  onChange,
  className = '',
}: {
  value: string;
  columns: string[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const selectedIndex = columns.indexOf(value);

  const getColorClass = (index: number, total: number) => {
    if (index === 0) {
      return 'bg-gray-100 hover:bg-gray-150';
    }

    if (index === total - 1) {
      return 'bg-green-100 hover:bg-green-150';
    }

    return 'bg-blue-100 hover:bg-blue-200';
  };

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: columns.map((col, index) => ({
          key: col,
          label: (
            <span
              className={`rounded px-2 py-1 text-black ${getColorClass(
                index,
                columns.length
              )}`}
            >
              {col}
            </span>
          ),
          onClick: () => onChange(col),
        })),
      }}
    >
      <Button
        style={{
          backgroundColor: 'var(--color-primary-500)',
          color: 'white',
        }}
        size="small"
        className={` ${className} ${getColorClass(selectedIndex, columns.length)} flex items-center gap-1 rounded-full border-none text-white`}
      >
        <span className="truncate">{value}</span>
        <DownOutlined className="text-[10px]" />
      </Button>
    </Dropdown>
  );
}
