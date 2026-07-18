import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTasksThunk } from '../../store/tasks/tasksSlice';
import type { TaskFilters } from '../../features/tasks/types/task.types';

export function useTasks(filters: TaskFilters) {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    void dispatch(fetchTasksThunk(filters));
  }, [dispatch, filters]);

  return {
    tasks: list?.tasks || [],
    pagination: list || { page: 1, limit: filters.limit, totalRecords: 0, totalPages: 0 },
    loading,
    error,
    reload: () => dispatch(fetchTasksThunk(filters))
  };
}
