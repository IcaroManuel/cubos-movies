import { useState } from 'react';

interface FilterMenuProps {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
}

const genresList = ['Ação', 'Aventura', 'Ficção Científica', 'Romance', 'Animação', 'Fantasia'];
const statusList = ['Lançado', 'Em breve', 'Cancelado'];

export function FilterMenu({
  selectedGenre,
  setSelectedGenre,
  selectedStatus,
  setSelectedStatus,
  selectedSort,
  setSelectedSort,
}: FilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveFilter = Boolean(selectedGenre || selectedStatus || selectedSort);

  function handleClearFilters() {
    setSelectedGenre('');
    setSelectedStatus('');
    setSelectedSort('');
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded px-6 py-3 font-semibold text-white transition-colors border bg-[color-mix(in_srgb,var(--purple-13)_10%,transparent)] ${
          hasActiveFilter
            ? 'bg-[var(--mauve-4)] border-[var(--purple-9)]'
            : 'bg-[var(--mauve-3)] border-transparent hover:bg-[var(--mauve-4)]'
        }`}
      >
        Filtros
        {hasActiveFilter && (
          <span className="ml-2 rounded-full bg-[var(--purple-9)] px-2 py-0.5 text-xs">Ativo</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 z-50 mt-2 w-72 rounded-lg bg-[var(--mauve-2)] p-5 shadow-2xl border border-[var(--mauve-4)]">
          {/* Gênero */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--mauve-11)]">
              Gênero
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full rounded bg-[var(--mauve-3)] p-2 text-sm text-white border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none"
            >
              <option value="">Todos os gêneros</option>
              {genresList.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--mauve-11)]">
              Situação
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded bg-[var(--mauve-3)] p-2 text-sm text-white border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none"
            >
              <option value="">Todas as situações</option>
              {statusList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--mauve-11)]">
              Ordenar por
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full rounded bg-[var(--mauve-3)] p-2 text-sm text-white border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none"
            >
              <option value="">Mais recentes</option>
              <option value="score_desc">Melhores avaliados</option>
              <option value="score_asc">Piores avaliados</option>
            </select>
          </div>

          <div className="flex justify-end border-t border-[var(--mauve-4)] pt-4">
            <button
              onClick={handleClearFilters}
              className="text-sm font-semibold text-[var(--mauve-11)] hover:text-white transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
