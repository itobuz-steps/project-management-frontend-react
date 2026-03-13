import type {
  TaskPopulated,
  TaskReference,
} from '../../services/types/tasks.types';

export type RelationshipKey =
  | 'blocks'
  | 'blockedBy'
  | 'relatesTo'
  | 'duplicates';

export const RELATIONSHIP_CONFIG: Record<RelationshipKey, { label: string }> = {
  blocks: { label: 'Blocks' },
  blockedBy: { label: 'Is blocked by' },
  relatesTo: { label: 'Relates to' },
  duplicates: { label: 'Duplicates' },
};

export interface LinkedItemsTabProps {
  task: TaskPopulated;
  onUpdated: (task: TaskPopulated) => void;
}

export type LinkedRow = {
  type: RelationshipKey;
  item: TaskReference;
};

export interface LinkedItemsAddPanelProps {
  task: TaskPopulated;
  projectTasks: TaskPopulated[];
  onAdd: (type: RelationshipKey, id: string) => Promise<void>;
  onClose: () => void;
}

export interface LinkedItemsTableProps {
  rows: LinkedRow[];
  projectColumns: string[];
  onRemove: (type: LinkedRow['type'], id: string) => void;
  // pass full updated task so parent has all fields
  onChange: (task: TaskPopulated) => void;
}

export interface StatusCellProps {
  row: LinkedRow;
  projectColumns: string[];
  // pass full updated task so parent has all fields
  onStatusChange: (task: TaskPopulated) => void;
}

export interface LinkColumnsProps {
  projectColumns: string[];
  onRemove: (type: LinkedRow['type'], id: string) => void;
  onChange: (task: TaskPopulated) => void;
}
