import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { Task } from '../types/task.types';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusClass: Record<Task['status'], string> = {
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  'In Progress': 'bg-blue-50 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300',
  Completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300'
};

const priorityClass: Record<Task['priority'], string> = {
  Low: 'text-slate-500 dark:text-slate-300',
  Medium: 'text-amber-600 dark:text-amber-300',
  High: 'text-red-600 dark:text-red-300'
};

export default function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
            <tr><th className="px-5 py-4">Task</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Priority</th><th className="px-5 py-4">Due date</th><th className="px-5 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map((task) => (
              <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50" key={task.id}>
                <td className="max-w-md px-5 py-4"><p className="font-semibold text-slate-800 dark:text-slate-100">{task.title}</p><p className="mt-1 truncate text-slate-500 dark:text-slate-400">{task.description || 'No description'}</p></td>
                <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[task.status]}`}>{task.status}</span></td>
                <td className={`px-5 py-4 font-semibold ${priorityClass[task.priority]}`}>{task.priority}</td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-300">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button className="h-10 w-10 p-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" size="default" variant="outline" title="Edit task" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button className="h-10 w-10 border-red-200 p-0 text-red-600 hover:bg-red-50 dark:border-red-400/40 dark:bg-slate-800 dark:text-red-300 dark:hover:bg-red-950/40" size="default" variant="outline" title="Delete task" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
        {tasks.map((task) => (
          <article className="space-y-3 border-slate-100 p-4 dark:border-slate-800 sm:p-5" key={task.id}>
            <div className="flex items-start justify-between gap-3"><h3 className="min-w-0 break-words font-semibold text-slate-800 dark:text-slate-100">{task.title}</h3><span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${statusClass[task.status]}`}>{task.status}</span></div>
            <p className="max-h-10 overflow-hidden text-sm leading-5 text-slate-500 dark:text-slate-400">{task.description || 'No description'}</p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className={`font-semibold ${priorityClass[task.priority]}`}>{task.priority} priority</span><span className="text-slate-500 dark:text-slate-300">Due {new Date(task.dueDate).toLocaleDateString()}</span></div>
            <div className="flex gap-2 pt-1">
              <Button className="flex-1 gap-2" variant="outline" onClick={() => onEdit(task)}><Pencil className="h-4 w-4" /> Edit</Button>
              <Button className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-400/40 dark:bg-slate-800 dark:text-red-300 dark:hover:bg-red-950/40" variant="outline" onClick={() => onDelete(task)}><Trash2 className="h-4 w-4" /> Delete</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
