import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Pagination({ children }: { children: ReactNode }) {
  return <nav aria-label="Pagination" className="mx-auto flex w-full justify-center">{children}</nav>;
}

export function PaginationContent({ children }: { children: ReactNode }) {
  return <ul className="flex items-center gap-1">{children}</ul>;
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
        'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition',
        active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100',
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
  return <PaginationLink disabled={disabled} onClick={onClick}><ChevronLeft className="mr-1 h-4 w-4" />Previous</PaginationLink>;
}

export function PaginationNext({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return <PaginationLink disabled={disabled} onClick={onClick}>Next<ChevronRight className="ml-1 h-4 w-4" /></PaginationLink>;
}
