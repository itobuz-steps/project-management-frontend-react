import { Empty, Spin } from 'antd';
import type { DataLoaderProps } from './ui.types';

export function DataLoader({
  loading,
  isEmpty,
  emptyText = 'No data',
  children,
}: DataLoaderProps) {
  if (loading) {
    return (
      <div className="py-6 text-center">
        <Spin />
      </div>
    );
  }

  if (isEmpty) {
    return <Empty description={emptyText} />;
  }

  return <>{children}</>;
}
