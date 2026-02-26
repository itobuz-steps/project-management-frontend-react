import { useState, useMemo } from 'react';
import { Collapse, Button, Empty } from 'antd';
import { Plus } from 'lucide-react';
import type {
  RelationshipKey,
  LinkedRow,
  LinkedItemsTabProps,
} from './linkedItems.types';
import { RELATIONSHIP_CONFIG } from './linkedItems.types';
import { useLinkedItems } from '../../hooks/useLinkedItems';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { LinkedItemsTable } from './LinkedItemsTable';
import { LinkedItemsAddPanel } from './LinkedItemsAddPanel';
import type {
  TaskPopulated,
  TaskReference,
} from '../../services/types/tasks.types';

export function LinkedItemsTab({ task, onUpdated }: LinkedItemsTabProps) {
  const [addOpen, setAddOpen] = useState(false);

  const projectId =
    typeof task.projectId === 'string' ? task.projectId : task.projectId._id;

  const { tasks: projectTasks } = useProjectTasks(projectId);
  const { columns: projectColumns } = useProjectMetaData(projectId);
  const { addLinkedItem, removeLinkedItem } = useLinkedItems(task, onUpdated);

  const linkedRows = useMemo<LinkedRow[]>(() => {
    const map = new Map<string, LinkedRow>();

    (Object.keys(RELATIONSHIP_CONFIG) as RelationshipKey[]).forEach((type) => {
      (task[type] ?? []).forEach((item) => {
        if (!item?._id) {
          return;
        }

        const key = `${type}-${item._id}`;

        if (!map.has(key)) {
          map.set(key, { type, item });
        }
      });
    });

    return Array.from(map.values());
  }, [task]);

  const handleChange = (updatedLinkedTask: TaskReference) => {
    const updatedTask: TaskPopulated = { ...task };

    (Object.keys(RELATIONSHIP_CONFIG) as RelationshipKey[]).forEach((type) => {
      updatedTask[type] = (task[type] ?? []).map((item) =>
        item._id === updatedLinkedTask._id ? updatedLinkedTask : item
      );
    });

    onUpdated(updatedTask);
  };

  const hasItems = linkedRows.length > 0;

  return (
    <Collapse ghost>
      <Collapse.Panel
        key="linked"
        header={
          <div className="flex w-full items-center justify-between">
            <span className="font-semibold">Linked work items</span>

            <Button
              size="small"
              icon={<Plus size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                setAddOpen((prev) => !prev);
              }}
            >
              Add
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <LinkedItemsTable
            rows={linkedRows}
            projectColumns={projectColumns}
            onRemove={removeLinkedItem}
            onChange={handleChange}
          />

          {!hasItems && !addOpen && <Empty description="No linked items" />}

          {addOpen && (
            <LinkedItemsAddPanel
              task={task}
              projectTasks={projectTasks}
              onAdd={addLinkedItem}
              onClose={() => setAddOpen(false)}
            />
          )}
        </div>
      </Collapse.Panel>
    </Collapse>
  );
}
