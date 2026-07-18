import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskPageShell from '../components/TaskPageShell';
import { useCreateTask } from '../../../hooks/tasks/useCreateTask';
import type { TaskInput } from '../types/task.types';

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const { createTask, isPending } = useCreateTask();

  const submit = async (input: TaskInput) => {
    await createTask(input);
    navigate('/dashboard');
  };

  return (
    <TaskPageShell title="Create a task" description="Add a task to your workspace.">
      <TaskForm saving={isPending} onSubmit={submit} onCancel={() => navigate('/dashboard')} />
    </TaskPageShell>
  );
}
