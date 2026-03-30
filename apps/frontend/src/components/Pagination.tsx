interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-2 pb-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded bg-[var(--mauve-3)] text-[var(--mauve-11)] transition-colors hover:bg-[var(--mauve-4)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`flex h-10 w-10 items-center justify-center rounded transition-colors ${
            currentPage === p
              ? 'bg-[var(--purple-9)] text-white font-bold'
              : 'bg-[var(--mauve-3)] text-[var(--mauve-11)] hover:bg-[var(--mauve-4)] hover:text-white'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded bg-[var(--mauve-3)] text-[var(--mauve-11)] transition-colors hover:bg-[var(--mauve-4)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    </div>
  );
}
