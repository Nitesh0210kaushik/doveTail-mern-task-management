import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={() => onOpenChange(false)}>
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-bold text-slate-900">{children}</h2>;
}

export function DialogClose({ onClick }: { onClick: () => void }) {
  return <button className={cn('rounded-lg px-2 py-1 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700')} onClick={onClick} type="button" aria-label="Close dialog">×</button>;
}

export function DialogBody({ children }: { children: ReactNode }) {
  return <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>;
}
