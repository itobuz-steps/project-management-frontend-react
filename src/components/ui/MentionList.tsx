import { forwardRef, useImperativeHandle, useState } from 'react';
import { Avatar, List } from 'antd';
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
      <div className="mention-dropdown w-56 rounded-md border bg-white shadow">
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
              <div className="flex items-center gap-2">
                <Avatar size={20} src={item.avatar || '/profile.png'} />
                <span>{item.label}</span>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
);
