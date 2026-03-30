import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; // NOVO: Importamos o useEffect
import { api } from '../lib/api';
import type { MoviesResponse } from '../dtos/movies';
import { useDebounce } from '../hooks/useDebounce';
import { MovieList } from '../components/MovieList';
import { Pagination } from '../components/Pagination';
import { FilterMenu } from '../components/FilterMenu';

export function Home() {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedGenre, selectedStatus, selectedSort]);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<MoviesResponse>({
    queryKey: ['movies', debouncedSearch, selectedGenre, selectedStatus, selectedSort, page],
    queryFn: async () => {
      const res = await api.get('/movies', {
        params: {
          search: debouncedSearch || undefined,
          genre: selectedGenre || undefined,
          status: selectedStatus || undefined,
          sort: selectedSort || undefined,
          page: page,
          limit: 10,
        },
      });
      return res.data;
    },
  });

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-end relative">
        <div
          className="absolute w-screen left-1/2 -translate-x-1/2 top-[-1] h-[60vh] bg-cover bg-[center_top_-150px] bg-no-repeat opacity-20 grayscale z-0"
          style={{ backgroundImage: "url('/background.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--mauve-1)]/30 to-[var(--mauve-1)]" />
        </div>

        <div className="flex flex-row gap-4">
          <div className="relative w-full md:w-[400px]">
            <input
              type="text"
              placeholder="Pesquise por filmes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded bg-[var(--mauve-2)] p-3 pr-10 text-white border border-[var(--mauve-4)] focus:border-[var(--purple-9)] focus:outline-none transition-colors placeholder-[var(--mauve-11)]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--mauve-11)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          <div className="flex shrink-0 items-center gap-3 relative">
            <FilterMenu
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
            />

            <Link
              to="/movies/new"
              className="rounded bg-[var(--purple-9)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--purple-10)] text-center"
            >
              Adicionar Filme
            </Link>
          </div>
        </div>
      </div>

      {isLoading && <p className="text-[var(--mauve-11)]">Buscando filmes...</p>}
      {isError && <p className="text-red-400">Erro ao carregar os filmes.</p>}
      {!isLoading && !isError && response?.data.length === 0 && (
        <p className="text-[var(--mauve-11)]">Nenhum filme encontrado com os filtros atuais.</p>
      )}

      <MovieList movies={response?.data ?? []} />

      {!isLoading && !isError && response?.totalPages && (
        <Pagination currentPage={page} totalPages={response.totalPages} onPageChange={setPage} />
      )}
    </>
  );
}
