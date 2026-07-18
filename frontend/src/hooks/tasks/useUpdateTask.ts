import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateTaskThunk } from '../../store/tasks/tasksSlice';
import type { TaskInput } from '../../features/tasks/types/task.types';

export function useUpdateTask() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.tasks);

  const updateTask = async (variables: { taskId: string; input: Partial<TaskInput> }) => {
    try {
      const result = await dispatch(updateTaskThunk(variables)).unwrap();
      toast.success('Task updated successfully.');
      return result;
    } catch (requestError) {
      toast.error(String(requestError));
      throw requestError;
    }
  };

  return {
    updateTask,
    isPending: loading,
    error,
  };
}
