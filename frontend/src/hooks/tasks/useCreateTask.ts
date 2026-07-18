import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createTaskThunk } from '../../store/tasks/tasksSlice';
import type { TaskInput } from '../../features/tasks/types/task.types';

export function useCreateTask() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.tasks);

  const createTask = async (input: TaskInput) => {
    try {
      const result = await dispatch(createTaskThunk(input)).unwrap();
      toast.success('Task created successfully.');
      return result;
    } catch (requestError) {
      toast.error(String(requestError));
      throw requestError;
    }
  };

  return {
    createTask,
    isPending: loading,
    error,
  };
}
