import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Dialog, DialogBody, DialogClose, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import TaskFilters from '../features/tasks/components/TaskFilters';
import TaskForm from '../features/tasks/components/TaskForm';
import TaskPagination from '../features/tasks/components/TaskPagination';
import TaskTable from '../features/tasks/components/TaskTable';
import type { Task, TaskFilters as Filters, TaskInput } from '../features/tasks/types/task.types';

const initialFilters: Filters = {
  search: '',
  status: '',
  priority: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const { tasks, pagination, loading, error, create, update, remove } = useTasks(filters);

  const signOut = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const openCreate = () => {
    setSelectedTask(null);
    setActionError('');
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setActionError('');
    setFormOpen(true);
  };

  const submitTask = async (input: TaskInput) => {
    setSaving(true);
    setActionError('');
    try {
      if (selectedTask) await update(selectedTask.id, input);
      else await create(input);
      setFormOpen(false);
      setSelectedTask(null);
    } catch (requestError: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setActionError(message || 'Unable to save this task.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (task: Task) => {
    setActionError('');
    setTaskToDelete(task);
  };

  const deleteSelectedTask = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      await remove(taskToDelete.id);
      setTaskToDelete(null);
    } catch {
      setActionError('Unable to delete this task.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <div><p className="font-bold tracking-[0.2em] text-blue-600">TASKFLOW</p><p className="mt-1 text-xs text-slate-400">Your task workspace</p></div>
          <Button className="h-10 px-3 sm:px-4" variant="outline" onClick={signOut}>Sign out</Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Dashboard</p><h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Your tasks</h1><p className="mt-2 text-sm text-slate-500 sm:text-base">Plan, prioritize, and keep your work moving.</p></div>
          <Button className="w-full sm:w-auto" onClick={openCreate}>+ New task</Button>
        </div>

        {actionError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>}

        <TaskFilters filters={filters} onChange={setFilters} />

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Edit task' : 'Create a task'}</DialogTitle>
            <DialogClose onClick={() => setFormOpen(false)} />
          </DialogHeader>
          <DialogBody>
            <TaskForm task={selectedTask} saving={saving} onSubmit={submitTask} onCancel={() => setFormOpen(false)} />
          </DialogBody>
        </Dialog>

        <Dialog open={Boolean(taskToDelete)} onOpenChange={(open) => !open && setTaskToDelete(null)}>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogClose onClick={() => setTaskToDelete(null)} />
          </DialogHeader>
          <DialogBody>
            <p className="text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-900">{taskToDelete?.title}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setTaskToDelete(null)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700" disabled={deleting} onClick={deleteSelectedTask}>
                {deleting ? 'Deleting...' : 'Delete task'}
              </Button>
            </div>
          </DialogBody>
        </Dialog>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Loading tasks...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
            <h2 className="text-xl font-bold text-slate-800">No tasks found</h2>
            <p className="mt-2 text-slate-500">Create your first task or adjust your filters.</p>
            <Button className="mt-6" onClick={openCreate}>Create your first task</Button>
          </div>
        ) : (
          <>
            <TaskTable tasks={tasks} onEdit={openEdit} onDelete={confirmDelete} />
            <TaskPagination pagination={pagination} onPageChange={(page) => setFilters({ ...filters, page })} />
          </>
        )}
      </section>
    </main>
  );
}
