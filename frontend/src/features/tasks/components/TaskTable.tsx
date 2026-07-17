import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { Task } from '../types/task.types';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusClass: Record<Task['status'], string> = {
  Pending: 'bg-amber-50 text-amber-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700'
};

const priorityClass: Record<Task['priority'], string> = {
  Low: 'text-slate-500',
  Medium: 'text-amber-600',
  High: 'text-red-600'
};

export default function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="px-5 py-4">Task</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Priority</th><th className="px-5 py-4">Due date</th><th className="px-5 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <tr className="transition hover:bg-slate-50" key={task.id}>
                <td className="max-w-md px-5 py-4"><p className="font-semibold text-slate-800">{task.title}</p><p className="mt-1 truncate text-slate-500">{task.description}</p></td>
                <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[task.status]}`}>{task.status}</span></td>
                <td className={`px-5 py-4 font-semibold ${priorityClass[task.priority]}`}>{task.priority}</td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-500">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button className="h-10 w-10 p-0" size="default" variant="outline" title="Edit task" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button className="h-10 w-10 border-red-200 p-0 text-red-600 hover:bg-red-50" size="default" variant="outline" title="Delete task" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-slate-100 md:hidden">
        {tasks.map((task) => (
          <article className="space-y-3 p-4 sm:p-5" key={task.id}>
            <div className="flex items-start justify-between gap-3"><h3 className="min-w-0 break-words font-semibold text-slate-800">{task.title}</h3><span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${statusClass[task.status]}`}>{task.status}</span></div>
            <p className="max-h-10 overflow-hidden text-sm leading-5 text-slate-500">{task.description}</p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className={`font-semibold ${priorityClass[task.priority]}`}>{task.priority} priority</span><span className="text-slate-500">Due {new Date(task.dueDate).toLocaleDateString()}</span></div>
            <div className="flex gap-2 pt-1">
              <Button className="flex-1 gap-2" variant="outline" onClick={() => onEdit(task)}><Pencil className="h-4 w-4" /> Edit</Button>
              <Button className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50" variant="outline" onClick={() => onDelete(task)}><Trash2 className="h-4 w-4" /> Delete</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
