import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  importTasksFromCsv,
  type ImportTasksErrorBody,
  type ImportTasksResult,
} from '../services/taskService';

export function useImportTasks(projectId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ImportTasksResult,
    AxiosError<ImportTasksErrorBody>,
    { file: File }
  >({
    mutationFn: ({ file }) => importTasksFromCsv(projectId, file),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const serverRowErrors: string[] =
    mutation.error?.response?.data?.errors ?? [];

  const serverMessage: string | null = !serverRowErrors.length
    ? (mutation.error?.response?.data?.message ??
      mutation.error?.message ??
      null)
    : null;

  return {
    importTasks: (file: File) => mutation.mutate({ file }),
    importTasksAsync: (file: File) => mutation.mutateAsync({ file }),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    result: mutation.data ?? null,
    serverRowErrors,
    serverMessage,
    reset: mutation.reset,
  };
}
