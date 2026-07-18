import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Pagination({ children }: { children: ReactNode }) {
  return <nav aria-label="Pagination" className="mx-auto flex w-full justify-center">{children}</nav>;
}

export function PaginationContent({ children }: { children: ReactNode }) {
  return <ul className="flex items-center gap-0.5 sm:gap-1">{children}</ul>;
}

export function PaginationItem({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

interface PaginationLinkProps {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function PaginationLink({ active, disabled, onClick, children }: PaginationLinkProps) {
  return (
    <button
      className={cn(
        'inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition sm:h-9 sm:min-w-9 sm:px-3 sm:text-sm',
        active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
        disabled && 'pointer-events-none opacity-40'
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function PaginationPrevious({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <PaginationLink disabled={disabled} onClick={onClick}>
      <ChevronLeft className="h-4 w-4 sm:mr-1" />
      <span className="hidden sm:inline">Previous</span>
    </PaginationLink>
  );
}

export function PaginationNext({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <PaginationLink disabled={disabled} onClick={onClick}>
      <span className="hidden sm:inline">Next</span>
      <ChevronRight className="h-4 w-4 sm:ml-1" />
    </PaginationLink>
  );
}
