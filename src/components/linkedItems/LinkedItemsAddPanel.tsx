import { useState, useMemo } from 'react';
import { Input, Select, Tag } from 'antd';
import type {
  LinkedItemsAddPanelProps,
  RelationshipKey,
} from './linkedItems.types';
import { RELATIONSHIP_CONFIG } from './linkedItems.types';

export function LinkedItemsAddPanel({
  task,
  projectTasks,
  onAdd,
  onClose,
}: LinkedItemsAddPanelProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<RelationshipKey>('blocks');

  const allLinkedIds = useMemo(() => {
    const ids: string[] = [];

    (Object.keys(RELATIONSHIP_CONFIG) as RelationshipKey[]).forEach((type) => {
      (task[type] ?? []).forEach((item) => {
        if (item?._id) {
          ids.push(item._id);
        }
      });
    });

    return Array.from(new Set(ids));
  }, [task]);

  const filteredTasks = projectTasks.filter(
    (linkedTask) =>
      linkedTask._id !== task._id &&
      !allLinkedIds.includes(linkedTask._id) &&
      `${linkedTask.key} ${linkedTask.title}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3 border-t pt-3">
      <Select
        value={selectedType}
        onChange={(value) => setSelectedType(value)}
        className="w-full"
        options={(Object.keys(RELATIONSHIP_CONFIG) as RelationshipKey[]).map(
          (type) => ({
            value: type,
            label: RELATIONSHIP_CONFIG[type].label,
          })
        )}
      />

      <Input
        placeholder="Search issues..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-48 overflow-y-auto">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-100"
            onClick={async () => {
              await onAdd(selectedType, task._id);
              setSearch('');
              onClose();
            }}
          >
            <Tag color="blue">{task.key}</Tag>
            <span>{task.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
