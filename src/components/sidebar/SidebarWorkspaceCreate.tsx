import { AxiosError } from 'axios';
import { Plus, SendHorizontal } from 'lucide-react';
import { useState } from 'react';
import { createWorkspace } from '../../services/workspaceService';
import { message } from 'antd';

type SidebarWorkspaceCreateProps = {
  visible: boolean;
  onCreated: () => void;
};

export default function SidebarWorkspaceCreate({
  visible,
  onCreated,
}: SidebarWorkspaceCreateProps) {
  const [workspaceInputOpen, setWorkspaceInputOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  async function handleCreateWorkspace() {
    const trimmedName = workspaceName.trim();
    if (!trimmedName || isCreatingWorkspace) return;

    try {
      setIsCreatingWorkspace(true);
      await createWorkspace(trimmedName);
      message.success('Workspace created successfully!');
      setWorkspaceName('');
      setWorkspaceInputOpen(false);
      onCreated();
    } catch (error) {
      console.error('Failed to create workspace:', error);
      if (error instanceof AxiosError) {
        message.error(
          'Workspace creation failed: ' +
            (error.response?.data?.message || error.message)
        );
      } else {
        message.error('Workspace creation failed. Please try again.');
      }
    } finally {
      setIsCreatingWorkspace(false);
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <li className="mt-1">
      {!workspaceInputOpen ? (
        <button
          type="button"
          className="hover:border-primary-200 hover:bg-primary-50 flex w-full cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white/80 px-2 py-1.5 text-xs font-semibold text-slate-700 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700"
          onClick={() => setWorkspaceInputOpen(true)}
        >
          <Plus size={14} />
          Create workspace
        </button>
      ) : (
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void handleCreateWorkspace();
          }}
        >
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Workspace name"
            disabled={isCreatingWorkspace}
            autoFocus
            className="focus:border-primary-300 focus:ring-primary-200 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={isCreatingWorkspace || !workspaceName.trim()}
            className="bg-primary-100 text-primary-900 hover:bg-primary-200 inline-flex shrink-0 items-center justify-center rounded-md border border-transparent p-1.5 transition-colors disabled:bg-slate-200 disabled:text-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            title="Create workspace"
          >
            <SendHorizontal size={14} />
          </button>
        </form>
      )}
    </li>
  );
}
