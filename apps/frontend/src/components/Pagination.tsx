interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | null)[] {
  // Com poucas páginas não precisa de ellipsis
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | null)[] = [];

  // Páginas sempre visíveis: primeira, última, atual e vizinhas
  const alwaysShow = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);

  let last: number | null = null;

  for (let p = 1; p <= totalPages; p++) {
    if (alwaysShow.has(p)) {
      // Se há uma lacuna entre o último número adicionado e este, insere ellipsis
      if (last !== null && p - last > 1) {
        pages.push(null);
      }
      pages.push(p);
      last = p;
    }
  }

  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const btnBase = 'flex h-10 w-10 items-center justify-center rounded transition-colors';
  const btnInactive =
    'bg-[var(--mauve-3)] text-[var(--mauve-11)] hover:bg-[var(--mauve-4)] hover:text-white';
  const btnActive = 'bg-[var(--purple-9)] text-white font-bold';
  const btnNav = `${btnBase} ${btnInactive} disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="mt-12 flex items-center justify-center gap-2 pb-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={btnNav}
      >
        &lt;
      </button>

      {pages.map((p, i) =>
        p === null ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-10 w-10 items-center justify-center text-[var(--mauve-11)]"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btnBase} ${currentPage === p ? btnActive : btnInactive}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={btnNav}
      >
        &gt;
      </button>
    </div>
  );
}
