import { useCallback } from 'react';
import type { TaskPopulated } from '../services/types/tasks.types';
import { toFileName } from '../utils/exports/formatter';
import { exportTaskPDF } from '../utils/exports/exporters/pdf';
import { exportTaskExcel } from '../utils/exports/exporters/excel';
import { exportTaskXML } from '../utils/exports/exporters/xml';

export function useTaskExport(task: TaskPopulated) {
  const fileName = toFileName(task.title);
  const exportPDF = useCallback(
    () => exportTaskPDF(task, fileName),
    [task, fileName]
  );
  const exportExcel = useCallback(
    () => exportTaskExcel(task, fileName),
    [task, fileName]
  );
  const exportXML = useCallback(
    () => exportTaskXML(task, fileName),
    [task, fileName]
  );
  return { exportPDF, exportExcel, exportXML };
}
