import { useState, useMemo, useEffect, useRef } from 'react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const filteredTasks = useMemo(() => {
    return projectTasks.filter(
      (linkedTask) =>
        linkedTask._id !== task._id &&
        !allLinkedIds.includes(linkedTask._id) &&
        `${linkedTask.key} ${linkedTask.title}`
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [projectTasks, task._id, allLinkedIds, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-24 sm:w-36">
          <Select
            value={selectedType}
            onChange={(value) => setSelectedType(value)}
            className="w-full"
            options={(
              Object.keys(RELATIONSHIP_CONFIG) as RelationshipKey[]
            ).map((type) => ({
              value: type,
              label: RELATIONSHIP_CONFIG[type].label,
            }))}
          />
        </div>

        <div ref={containerRef} className="relative flex-1">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border bg-white shadow-lg">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((linkedTask) => (
                  <div
                    key={linkedTask._id}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100"
                    onClick={async () => {
                      await onAdd(selectedType, linkedTask._id);
                      setSearch('');
                      setDropdownOpen(false);
                      onClose();
                    }}
                  >
                    <Tag color="blue">{linkedTask.key}</Tag>
                    <span className="truncate">{linkedTask.title}</span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-400">
                  No results
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
