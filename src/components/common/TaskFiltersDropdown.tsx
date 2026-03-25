import { useMemo, useState } from 'react';
import { Select } from 'antd';
import type { ReactNode } from 'react';
import type { SetURLSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { PRIORITIES } from '../taskModal/constants';
import { UserCell } from '../ui/UserCell';
import type { User } from '../../services/types/tasks.types';
import {
  formatFilterLabel,
  getActiveTaskFilterCount,
  type MultiTaskFilterKey,
  SORT_FIELD_OPTIONS,
  SORT_ORDER_OPTIONS,
  type SingleTaskFilterKey,
  TASK_TYPE_OPTIONS,
} from '../../config/taskFilters';

type TaskFiltersDropdownProps = {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  statusOptions: string[];
  members: User[];
  loadingMembers: boolean;
  onOpenFilters: () => void;
  onClearFilters: () => void;
};

export function TaskFiltersDropdown({
  searchParams,
  setSearchParams,
  statusOptions,
  members,
  loadingMembers,
  onOpenFilters,
  onClearFilters,
}: TaskFiltersDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateMultiFilter = (key: MultiTaskFilterKey, values: string[]) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (values.length) {
        next.set(key, values.join(','));
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const updateSingleFilter = (key: SingleTaskFilterKey, value?: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const getValues = (key: MultiTaskFilterKey) =>
    (searchParams.get(key) ?? '').split(',').filter(Boolean);

  const getValue = (key: SingleTaskFilterKey) =>
    searchParams.get(key) || undefined;

  const activeFilterCount = useMemo(
    () => getActiveTaskFilterCount(searchParams),
    [searchParams]
  );

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          onOpenFilters();
        }}
        className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:w-auto dark:border-[#27272e] dark:text-slate-200 dark:hover:bg-[#27272e]"
      >
        <SlidersHorizontal className="mr-1.5 h-4 w-4" />
        Filters
        {activeFilterCount ? (
          <span className="bg-primary-500 ml-2 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold text-white">
            {activeFilterCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-20 mt-2 w-88 rounded-md border border-gray-200 bg-white p-3 shadow-lg dark:border-[#27272e] dark:bg-[#1b1b1f]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-slate-400">
              Filter tasks
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className="text-primary-600 hover:text-primary-500 text-xs font-semibold"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <MultiFilterSelect
              label="Type"
              mode="multiple"
              placeholder="Any type"
              value={getValues('type')}
              onChange={(values) => updateMultiFilter('type', values)}
              options={TASK_TYPE_OPTIONS.map((value) => ({
                value,
                label: formatFilterLabel(value),
              }))}
            />

            <MultiFilterSelect
              label="Status"
              mode="multiple"
              placeholder="Any status"
              value={getValues('status')}
              onChange={(values) => updateMultiFilter('status', values)}
              options={statusOptions.map((value) => ({
                value,
                label: formatFilterLabel(value),
              }))}
            />

            <MultiFilterSelect
              label="Priority"
              mode="multiple"
              placeholder="Any priority"
              value={getValues('priority')}
              onChange={(values) => updateMultiFilter('priority', values)}
              options={PRIORITIES.map((value) => ({
                value,
                label: formatFilterLabel(value),
              }))}
            />

            <MultiFilterSelect
              label="Assignee"
              mode="multiple"
              placeholder="Any assignee"
              value={getValues('assignee')}
              onChange={(values) => updateMultiFilter('assignee', values)}
              loading={loadingMembers}
              options={members.map((member) => ({
                value: member._id,
                label: <UserCell user={member} emptyText="Unassigned" />,
              }))}
            />

            <MultiFilterSelect
              label="Reporter"
              mode="multiple"
              placeholder="Any reporter"
              value={getValues('reporter')}
              onChange={(values) => updateMultiFilter('reporter', values)}
              loading={loadingMembers}
              options={members.map((member) => ({
                value: member._id,
                label: <UserCell user={member} emptyText="Unknown" />,
              }))}
            />

            <MultiFilterSelect
              label="Tags"
              mode="tags"
              placeholder="Add or select tags"
              value={getValues('tags')}
              onChange={(values) => updateMultiFilter('tags', values)}
              tokenSeparators={[',']}
            />

            <div className="grid grid-cols-2 gap-2">
              <SingleFilterSelect
                label="Sort by"
                placeholder="Field"
                value={getValue('sortBy')}
                onChange={(value) => updateSingleFilter('sortBy', value)}
                options={SORT_FIELD_OPTIONS.map((value) => ({
                  value,
                  label: formatFilterLabel(value),
                }))}
              />

              <SingleFilterSelect
                label="Order"
                placeholder="Direction"
                value={getValue('sortOrder')}
                onChange={(value) => updateSingleFilter('sortOrder', value)}
                options={[...SORT_ORDER_OPTIONS]}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type MultiFilterSelectProps = {
  label: string;
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
  options?: { value: string; label: ReactNode }[];
  mode?: 'multiple' | 'tags';
  loading?: boolean;
  tokenSeparators?: string[];
};

function MultiFilterSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  mode,
  loading,
  tokenSeparators,
}: MultiFilterSelectProps) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-gray-500 dark:text-slate-400">
        {label}
      </p>
      <Select
        mode={mode}
        allowClear
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full"
        options={options}
        loading={loading}
        tokenSeparators={tokenSeparators}
      />
    </div>
  );
}

type SingleFilterSelectProps = {
  label: string;
  placeholder: string;
  value?: string;
  onChange: (value?: string) => void;
  options?: { value: string; label: ReactNode }[];
};

function SingleFilterSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
}: SingleFilterSelectProps) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-gray-500 dark:text-slate-400">
        {label}
      </p>
      <Select
        allowClear
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full"
        options={options}
      />
    </div>
  );
}
