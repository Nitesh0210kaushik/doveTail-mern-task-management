import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import ThemeToggle from '../components/ThemeToggle';
import { Dialog, DialogBody, DialogClose, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../hooks/auth/useAuth';
import { useTasks } from '../hooks/tasks/useTasks';
import { useDeleteTask } from '../hooks/tasks/useDeleteTask';
import TaskFilters from '../features/tasks/components/TaskFilters';
import TaskPagination from '../features/tasks/components/TaskPagination';
import TaskTable from '../features/tasks/components/TaskTable';
import type { Task, TaskFilters as Filters } from '../features/tasks/types/task.types';

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
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { tasks, pagination, loading, error } = useTasks(filters);
  const { deleteTask } = useDeleteTask();

  const signOut = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const openCreate = () => navigate('/tasks/new');

  const openEdit = (task: Task) => navigate(`/tasks/${task.id}/edit`);

  const confirmDelete = (task: Task) => {
    setTaskToDelete(task);
  };

  const deleteSelectedTask = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    } catch {
      return;
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-100 dark:bg-slate-950">
      <header className="border-b bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div><p className="font-bold tracking-[0.2em] text-blue-600">TASKFLOW</p><p className="mt-1 text-xs text-slate-400">Your task workspace</p></div>
          <div className="flex items-center gap-2"><ThemeToggle /><Button className="h-10 px-3 sm:px-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" variant="outline" onClick={signOut}>Sign out</Button></div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Your tasks</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">Plan, prioritize, and keep your work moving.</p></div>
          <Button className="w-full sm:w-auto" onClick={openCreate}>+ New task</Button>
        </div>

        <TaskFilters filters={filters} onChange={setFilters} />

        <Dialog open={Boolean(taskToDelete)} onOpenChange={(open) => !open && setTaskToDelete(null)}>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogClose onClick={() => setTaskToDelete(null)} />
          </DialogHeader>
          <DialogBody>
            <p className="text-slate-600 dark:text-slate-300">
              Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">{taskToDelete?.title}</span>?
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
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Loading tasks...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">No tasks found</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Create your first task or adjust your filters.</p>
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
