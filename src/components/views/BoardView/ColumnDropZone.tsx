import React, { type ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

export function ColumnDropZone({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: `column:${id}`,
    data: { type: 'column', column: id },
  });

  return (
    <div ref={setNodeRef} className={`min-h-30 rounded-md`}>
      {children}
    </div>
  );
}

export default ColumnDropZone;
