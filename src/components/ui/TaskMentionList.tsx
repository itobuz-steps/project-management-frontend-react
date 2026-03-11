import { forwardRef, useImperativeHandle, useState } from 'react';
import { List } from 'antd';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import type { TaskMentionListProps, TaskMentionListRef } from './ui.types';

export const TaskMentionList = forwardRef<
  TaskMentionListRef,
  TaskMentionListProps
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex(
          (prev) => (prev + props.items.length - 1) % props.items.length
        );
        
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % props.items.length);
        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  return (
    <List
      size="small"
      className="mention-dropdown max-h-60 overflow-y-auto rounded-md border bg-white shadow-md"
      dataSource={props.items}
      renderItem={(item, index) => (
        <List.Item
          className={`cursor-pointer px-3 py-2 ${
            index === selectedIndex ? 'bg-gray-100' : ''
          }`}
          onClick={() => selectItem(index)}
        >
          <div className="flex items-center gap-2">
            <TaskTypeIcon type={item.type} />
            <span>{item.label}</span>
          </div>
        </List.Item>
      )}
    />
  );
});
