import React from 'react';
import { Modal, Input } from 'antd';

export function AddColumnModal({
  open,
  value,
  onChange,
  onCancel,
  onOk,
  confirmLoading,
}: {
  open: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onOk: () => void;
  confirmLoading?: boolean;
}) {
  return (
    <Modal
      open={open}
      title="Add column"
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={confirmLoading}
      destroyOnHidden
      maskStyle={{
        backdropFilter: 'none',
        backgroundColor: 'rgba(0,0,0,0.45)',
      }}
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Column name</label>
        <Input
          placeholder="e.g. In Review"
          value={value}
          onChange={onChange}
          onPressEnter={onOk}
        />
      </div>
    </Modal>
  );
}

export function DeleteColumnModal({
  open,
  columnName,
  onCancel,
  onOk,
}: {
  open: boolean;
  columnName: string | null;
  onCancel: () => void;
  onOk: () => void;
}) {
  return (
    <Modal
      open={open}
      title="Delete column"
      onCancel={onCancel}
      onOk={onOk}
      okText="Yes, delete"
      okType="danger"
      cancelText="Cancel"
      destroyOnHidden
      maskStyle={{
        backdropFilter: 'none',
        backgroundColor: 'rgba(0,0,0,0.45)',
      }}
    >
      <p className="text-sm">
        Are you sure you want to delete the column "
        <strong>{columnName}</strong>"? All tasks in this column will be moved
        to the previous column or first column.
      </p>
    </Modal>
  );
}

export default AddColumnModal;
