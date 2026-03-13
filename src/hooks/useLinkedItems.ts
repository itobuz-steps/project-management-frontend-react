import { useState } from 'react';
import { updateTask } from '../services/taskService';
import type {
  TaskPopulated,
  TaskReference,
} from '../services/types/tasks.types';
import type { RelationshipKey } from '../components/linkedItems/linkedItems.types';
import { RELATIONSHIP_CONFIG } from '../components/linkedItems/linkedItems.types';
import { message } from 'antd';

export function useLinkedItems(
  task: TaskPopulated,
  onUpdated: (task: TaskPopulated) => void
) {
  const [loading, setLoading] = useState(false);

  const normalizeIds = (items: TaskReference[] = []) =>
    Array.from(new Set(items.map((item) => item?._id).filter(Boolean)));

  const getAllLinkedIds = () => {
    const allIds: string[] = [];

    (Object.keys(RELATIONSHIP_CONFIG) as RelationshipKey[]).forEach((key) => {
      allIds.push(...normalizeIds(task[key]));
    });

    return Array.from(new Set(allIds));
  };

  const addLinkedItem = async (type: RelationshipKey, targetId: string) => {
    try {
      setLoading(true);

      const allLinkedIds = getAllLinkedIds();

      if (allLinkedIds.includes(targetId)) {
        return;
      }

      const currentIds = normalizeIds(task[type]);
      const updatedIds = [...currentIds, targetId];

      const updatedTask = await updateTask(task._id, {
        [type]: updatedIds,
      });

      onUpdated(updatedTask);
      message.success('Linked Task added.');
    } catch {
      message.error('Failed to add linked task');
    } finally {
      setLoading(false);
    }
  };

  const removeLinkedItem = async (type: RelationshipKey, targetId: string) => {
    try {
      setLoading(true);

      const currentIds = normalizeIds(task[type]);
      const updatedIds = currentIds.filter((id) => id !== targetId);

      const updatedTask = await updateTask(task._id, {
        [type]: updatedIds,
      });

      onUpdated(updatedTask);
      message.success('Linked Task removed.');
    } catch {
      message.error('Failed to remove linked task');
    } finally {
      setLoading(false);
    }
  };

  return { loading, addLinkedItem, removeLinkedItem };
}
