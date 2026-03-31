import { useState } from 'react';

interface FilterMenuProps {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
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
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  duration,
  setDuration,
}: FilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveFilter = Boolean(
    selectedGenre || selectedStatus || selectedSort || startDate || endDate || duration,
  );

  function handleClearFilters() {
    setSelectedGenre('');
    setSelectedStatus('');
    setSelectedSort('');
    setStartDate('');
    setEndDate('');
    setDuration('');
    setIsOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`rounded px-6 py-3 font-semibold text-[var(--mauve-11)] transition-colors border bg-[color-mix(in_srgb,var(--purple-13)_10%,transparent)] ${
          hasActiveFilter
            ? 'bg-[var(--mauve-4)] border-[var(--purple-9)]'
            : 'bg-[var(--mauve-3)] border-transparent hover:bg-[var(--mauve-4)]'
        }`}
      >
        Filtros
        {hasActiveFilter && (
          <span className="ml-2 rounded-full bg-[var(--purple-9)] px-2 py-0.5 text-xs text-white">
            Ativo
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md rounded-lg bg-[var(--mauve-2)] p-6 shadow-2xl border border-[var(--mauve-4)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--mauve-12)]">Filtrar Filmes</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--mauve-11)] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--mauve-11)]">
                Data de Lançamento
              </label>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <span className="text-xs text-[var(--mauve-11)] mb-1 block">De:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded bg-[var(--mauve-3)] p-2 text-sm text-[var(--mauve-11)] border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none [color-scheme:dark]"
                  />
                </div>
                <div className="w-1/2">
                  <span className="text-xs text-[var(--mauve-11)] mb-1 block">Até:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded bg-[var(--mauve-3)] p-2 text-sm text-[var(--mauve-11)] border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--mauve-11)]">
                Duração Exata
              </label>
              <input
                type="text"
                placeholder="Ex: 120, 2h"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded bg-[var(--mauve-3)] p-2 text-sm text-[var(--mauve-11)] border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none placeholder:text-[var(--mauve-11)]/50"
              />
            </div>

            <div className="h-[1px] w-full bg-[var(--mauve-4)] my-4"></div>

            <div className="mb-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--mauve-11)]">
                Gênero
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full rounded bg-[var(--mauve-3)] p-2 text-sm text-[var(--mauve-11)] border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none"
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
                className="w-full rounded bg-[var(--mauve-3)] p-2 text-sm text-[var(--mauve-11)] border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none"
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
                className="w-full rounded bg-[var(--mauve-3)] p-2 text-sm text-[var(--mauve-11)] border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none"
              >
                <option value="">Mais recentes</option>
                <option value="score_desc">Melhores avaliados</option>
                <option value="score_asc">Piores avaliados</option>
              </select>
            </div>

            <div className="flex justify-between border-t border-[var(--mauve-4)] pt-6 mt-6">
              <button
                onClick={handleClearFilters}
                className="text-sm font-semibold text-[var(--mauve-11)] hover:text-white transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded bg-[var(--purple-9)] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--purple-10)]"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
