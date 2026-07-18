import { useEffect, useState } from 'react';
import { Input } from '../../../components/ui/input';
import { TASK_PRIORITIES, TASK_STATUSES, type TaskFilters as Filters } from '../types/task.types';

interface TaskFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const normalizedSearch = searchValue.trim();
    if (normalizedSearch.length > 0 && normalizedSearch.length < 3) return;
    if (normalizedSearch === filters.search) return;

    const timer = window.setTimeout(() => {
      onChange({ ...filters, search: normalizedSearch, page: 1 });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [searchValue, filters, onChange]);

  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 sm:p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <Input
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder="Search tasks by title..."
      />
      <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value as Filters['status'], page: 1 })}>
        <option value="">All statuses</option>
        {TASK_STATUSES.map((value) => <option key={value}>{value}</option>)}
      </select>
      <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" value={filters.priority} onChange={(event) => onChange({ ...filters, priority: event.target.value as Filters['priority'], page: 1 })}>
        <option value="">All priorities</option>
        {TASK_PRIORITIES.map((value) => <option key={value}>{value}</option>)}
      </select>
      <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" value={`${filters.sortBy}-${filters.sortOrder}`} onChange={(event) => {
        const [sortBy, sortOrder] = event.target.value.split('-') as [Filters['sortBy'], Filters['sortOrder']];
        onChange({ ...filters, sortBy, sortOrder, page: 1 });
      }}>
        <option value="createdAt-desc">Newest first</option>
        <option value="createdAt-asc">Oldest first</option>
        <option value="dueDate-asc">Due date soonest</option>
        <option value="dueDate-desc">Due date latest</option>
      </select>
      {searchValue.trim().length > 0 && searchValue.trim().length < 3 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 sm:col-span-2 md:col-span-4">Type at least 3 characters to search.</p>
      )}
    </div>
  );
}
