import { Empty, Spin } from 'antd';
import type { ReactNode } from 'react';

type DataStateProps = {
  loading: boolean;
  isEmpty: boolean;
  emptyText?: string;
  children: ReactNode;
};

export function DataState({
  loading,
  isEmpty,
  emptyText = 'No data',
  children,
}: DataStateProps) {
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
