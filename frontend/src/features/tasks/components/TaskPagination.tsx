import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../../../components/ui/pagination';
import type { Pagination as PaginationMeta } from '../types/task.types';

interface TaskPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function TaskPagination({ pagination, onPageChange }: TaskPaginationProps) {
  if (pagination.totalPages < 1) return null;
  const pages = Array.from({ length: pagination.totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="shrink-0 text-sm text-slate-500 dark:text-slate-300">{pagination.totalRecords} tasks</p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)} />
          </PaginationItem>
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink active={page === pagination.page} onClick={() => onPageChange(page)}>{page}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
