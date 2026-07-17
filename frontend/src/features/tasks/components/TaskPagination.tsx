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
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-sm text-slate-500">{pagination.totalRecords} tasks</p>
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
