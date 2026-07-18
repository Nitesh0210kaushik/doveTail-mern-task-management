import { useNavigate, useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskPageShell from '../components/TaskPageShell';
import { useTaskById } from '../../../hooks/tasks/useTaskById';
import { useUpdateTask } from '../../../hooks/tasks/useUpdateTask';
import type { TaskInput } from '../types/task.types';

export default function EditTaskPage() {
  const navigate = useNavigate();
  const { taskId = '' } = useParams();
  const { task, loading, error } = useTaskById(taskId);
  const { updateTask, isPending } = useUpdateTask();

  const submit = async (input: TaskInput) => {
    await updateTask({ taskId, input });
    navigate('/dashboard');
  };

  return (
    <TaskPageShell title="Edit task" description="Update the details of your task.">
      {loading ? <p className="py-8 text-center text-slate-500">Loading task...</p> : error ? <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p> : task ? <TaskForm task={task} saving={isPending} onSubmit={submit} onCancel={() => navigate('/dashboard')} /> : <p className="py-8 text-center text-slate-500">Task not found.</p>}
    </TaskPageShell>
  );
}
