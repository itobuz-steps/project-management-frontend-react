import { forwardRef, useImperativeHandle, useState } from 'react';
import { List } from 'antd';
import type { MentionItem, MentionListProps, MentionListRef } from './ui.types';

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (!items.length) {
          return false;
        }

        if (event.key === 'ArrowDown') {
          setSelectedIndex((i) => (i + 1) % items.length);
          return true;
        }

        if (event.key === 'ArrowUp') {
          setSelectedIndex((i) => (i - 1 + items.length) % items.length);
          return true;
        }

        if (event.key === 'Enter') {
          command(items[selectedIndex]);
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="w-56 rounded-md border bg-white shadow">
        <List<MentionItem>
          size="small"
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item
              className={`cursor-pointer px-2 py-1 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => command(item)}
            >
              {item.label}
            </List.Item>
          )}
        />
      </div>
    );
  }
);
