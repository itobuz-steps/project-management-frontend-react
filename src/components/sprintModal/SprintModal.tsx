import { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import Section from './Section';
import StatPill from './StatPill';
import { config } from '../../config/config';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { attachInterceptor } from '../../utils/attachInterceptor';
import axios from 'axios';
import { message } from 'antd';

const API_URL = `${config.api_base_url}/tasks`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

interface SprintModalProps {
  visible: boolean;
  onClose: () => void;
  sprintId: string;
  projectId: string;
}

const SprintModal = ({
  visible,
  onClose,
  sprintId,
  projectId,
}: SprintModalProps) => {
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<TaskPopulated[]>([]);
  const [pendingTasks, setPendingTasks] = useState<TaskPopulated[]>([]);
  const [backlogTasks, setBacklogTasks] = useState<TaskPopulated[]>([]);

  useEffect(() => {
    if (visible && sprintId && projectId) {
      fetchSprintData();
    }
  }, [visible, sprintId, projectId]);

  const fetchSprintData = async () => {
    setLoading(true);
    try {
      const [completedResponse, backlogResponse] = await Promise.all([
        api.get(
          `${config.api_base_url}/project/${projectId}/sprint/${sprintId}/completed-tasks`
        ),
        api.get(
          `${config.api_base_url}/project/${projectId}/sprint/${sprintId}/moved-to-backlog-tasks`
        ),
      ]);
      setCompletedTasks(completedResponse.data.result.completed || []);
      setPendingTasks(completedResponse.data.result.pending || []);
      setBacklogTasks(backlogResponse.data.result || []);
    } catch (error) {
      message.error('Failed to fetch sprint data');
      console.error('Error fetching sprint data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalTasks =
    completedTasks.length + pendingTasks.length + backlogTasks.length;
  const completionPct = totalTasks
    ? Math.round((completedTasks.length / totalTasks) * 100)
    : 0;
  const incompletePct = totalTasks
    ? Math.round((pendingTasks.length / totalTasks) * 100)
    : 0;
  const backlogPct = totalTasks
    ? Math.round((backlogTasks.length / totalTasks) * 100)
    : 0;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={820}
      centered
      title={null}
      className="sprint-review-modal"
      bodyStyle={{ padding: 0, borderRadius: 8, overflow: 'hidden' }}
      maskStyle={{ backdropFilter: 'none' }}
      closeIcon={
        <span className="flex h-7 w-7 items-center justify-center rounded text-[#626F86] hover:bg-[#F1F2F4] hover:text-[#172B4D] dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white">
          ✕
        </span>
      }
    >
      <div className="flex flex-col bg-white font-['Atlassian_Sans',ui-sans-serif,system-ui,sans-serif] dark:bg-neutral-800 dark:text-neutral-100">
        {/* ── Modal Header ── */}
        <div className="border-b border-[#DCDFE4] px-6 pt-5 pb-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold tracking-widest text-[#0C66E4] uppercase dark:text-blue-300">
                Sprint Review
              </p>
              <h2 className="text-[1.25rem] leading-tight font-bold text-[#172B4D] dark:text-white">
                Sprint Summary
              </h2>
              <p className="mt-1 text-sm text-[#626F86] dark:text-neutral-300">
                Review sprint performance and plan next steps.
              </p>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            <StatPill label="Total Issues" value={totalTasks} />
            <StatPill
              label="Completed"
              value={completedTasks.length}
              color="#1F845A"
            />
            <StatPill
              label="Incomplete"
              value={pendingTasks.length}
              color="#C25100"
            />
            <StatPill
              label="Moved to Backlog"
              value={backlogTasks.length}
              color="#44546F"
            />
          </div>

          {/* ── Stacked Progress Bar ── */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs text-[#626F86] dark:text-neutral-300">
                Sprint progress
              </span>
              <span className="text-xs font-semibold text-[#172B4D] dark:text-white">
                {completionPct}% complete
              </span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#DCDFE4] dark:bg-neutral-700">
              <div
                className="h-full bg-[#1F845A] transition-all"
                style={{ width: `${completionPct}%` }}
              />
              <div
                className="h-full bg-[#F79232] transition-all"
                style={{ width: `${incompletePct}%` }}
              />
              <div
                className="h-full bg-[#8993A4] transition-all"
                style={{ width: `${backlogPct}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center gap-4 text-xs text-[#626F86] dark:text-neutral-300">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-[#1F845A]" />
                Completed
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-[#F79232]" />
                Incomplete
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-[#8993A4]" />
                Backlog
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 dark:bg-neutral-800">
            <Spin size="large" />
            <span className="text-sm text-[#626F86] dark:text-neutral-300">
              Loading sprint data…
            </span>
          </div>
        ) : (
          <div
            className="space-y-3 overflow-y-auto px-6 py-5 dark:bg-neutral-800"
            style={{ maxHeight: '55vh' }}
          >
            <Section
              title="Completed"
              count={completedTasks.length}
              accentColor="#1F845A"
              emptyText="No completed issues in this sprint."
              tasks={completedTasks}
              defaultOpen
            />
            <Section
              title="Incomplete"
              count={pendingTasks.length}
              accentColor="#F79232"
              emptyText="No incomplete issues."
              tasks={pendingTasks}
              defaultOpen
            />
            <Section
              title="Moved to Backlog"
              count={backlogTasks.length}
              accentColor="#8993A4"
              emptyText="No issues moved to backlog."
              tasks={backlogTasks}
              defaultOpen={false}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SprintModal;
