import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTaskThunk } from '../../store/tasks/tasksSlice';

export function useTaskById(taskId: string) {
  const dispatch = useAppDispatch();
  const { selected, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    if (taskId) {
      void dispatch(fetchTaskThunk(taskId));
    }
  }, [dispatch, taskId]);

  return {
    task: selected,
    loading,
    error,
  };
}
