import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteTaskThunk } from '../../store/tasks/tasksSlice';

export function useDeleteTask() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.tasks);

  const deleteTask = async (taskId: string) => {
    try {
      const result = await dispatch(deleteTaskThunk(taskId)).unwrap();
      toast.success('Task deleted successfully.');
      return result;
    } catch (requestError) {
      toast.error(String(requestError));
      throw requestError;
    }
  };

  return {
    deleteTask,
    isPending: loading,
    error,
  };
}
