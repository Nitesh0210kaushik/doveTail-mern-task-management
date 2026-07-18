import { FormEvent, useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskInput } from '../types/task.types';

interface TaskFormProps {
  task?: Task | null;
  saving?: boolean;
  onSubmit: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
}

const toInputDate = (date?: string): string => {
  if (date) return new Date(date).toISOString().slice(0, 10);
  return new Date(Date.now() + 86400000).toISOString().slice(0, 10);
};

export default function TaskForm({ task, saving = false, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskInput['status']>('Pending');
  const [priority, setPriority] = useState<TaskInput['priority']>('Medium');
  const [dueDate, setDueDate] = useState(toInputDate());

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setStatus(task?.status || 'Pending');
    setPriority(task?.priority || 'Medium');
    setDueDate(toInputDate(task?.dueDate));
  }, [task]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ title, description, status, priority, dueDate: new Date(`${dueDate}T00:00:00.000Z`).toISOString() });
  };

  return (
    <form className="space-y-5" onSubmit={submit}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} minLength={2} maxLength={150} required placeholder="e.g. Plan the next sprint" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} placeholder="Add details about this task (optional)..." />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
          <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" value={status} onChange={(event) => setStatus(event.target.value as TaskInput['status'])}>
            {TASK_STATUSES.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Priority</span>
          <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" value={priority} onChange={(event) => setPriority(event.target.value as TaskInput['priority'])}>
            {TASK_PRIORITIES.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Due date</span>
          <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required />
        </label>
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : task ? 'Update task' : 'Create task'}</Button>
      </div>
    </form>
  );
}
