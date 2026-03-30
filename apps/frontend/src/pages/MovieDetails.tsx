import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useState } from 'react';
import type { Movie } from '../dtos/movies';
import { ScoreCircle } from '../components/ScoreCircle';
import { MetricBox } from '../components/MetricBox';

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery<Movie>({
    queryKey: ['movie', id],
    queryFn: async () => {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/movies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      navigate('/movies');
    },
    onError: (error: any) => {
      console.error(error);
      setDeleteError('Erro ao excluir o filme.');
    },
  });

  function handleDelete() {
    const confirmed = window.confirm(`Tem certeza que deseja excluir o filme "${movie?.title}"?`);
    if (confirmed) {
      deleteMutation.mutate();
    }
  }

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (isLoading) return <div className="p-8 text-white">Carregando detalhes...</div>;
  if (isError || !movie) return <div className="p-8 text-red-400">Filme não encontrado.</div>;

  return (
    <div className="min-h-screen bg-[#0E0E10] pb-16 font-sans">
      <div className="relative w-full pb-6">
        <div
          className="absolute inset-0 bg-cover bg-[center_top] opacity-80 z-0"
          style={{ backgroundImage: `url(${movie.backgroundUrl || movie.posterUrl})` }}
        />
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(to right, #0E0E10 0%, rgba(14,14,16,0.9) 20%, transparent 40%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-[#0E0E10]/80 to-transparent z-0" />
        <div className="relative z-10 mx-auto w-full px-6 md:px-12 lg:px-24 pt-12">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-[56px] leading-tight">
                {movie.title}
              </h1>
              {movie.originalTitle && (
                <p className="mt-2 text-sm text-gray-300">Título original: {movie.originalTitle}</p>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded bg-white/10 px-8 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deletando...' : 'Deletar'}
              </button>
              <button
                onClick={() => navigate(`/movies/${movie.id}/edit`)}
                className="rounded bg-[var(--purple-9)] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--purple-10)]"
              >
                Editar
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            <div className="w-full shrink-0 md:w-[380px] lg:w-[420px]">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full rounded-md shadow-2xl"
              />
            </div>

            <div className="flex flex-1 flex-col gap-12 xl:flex-row justify-between text-white">
              <div className="flex w-full flex-1 flex-col">
                <p className="mb-10 text-sm italic text-gray-400">Todo herói tem um começo.</p>

                <div className=" rounded mb-8 bg-[#232225]/80 p-6 backdrop-blur-sm border border-white/5">
                  <h2 className="mb-2 font-bold tracking-widest text-gray-400 uppercase">
                    Sinopse
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-300 xl:text-base">
                    {movie.synopsis}
                  </p>
                </div>

                <div className="p-3">
                  <h2 className="mb-4 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Generos
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="rounded bg-[#2D1B4E] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#B282F4]"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                {deleteError && <p className="mt-4 text-sm text-red-400">{deleteError}</p>}
              </div>

              <div className="flex w-full shrink-0 flex-col gap-4 xl:w-[540px] ">
                <div className="grid grid-cols-[1fr_1fr_90px] gap-3 mb-3 items-center">
                  <MetricBox title="Classificação Indicativa" value={movie.ageRating} />
                  <MetricBox title="Votos" value={movie.votes} />
                  <div className="flex">
                    <ScoreCircle score={movie.score || 0} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MetricBox title="Lançamento" value={formatDate(movie.releaseDate)} />
                  <MetricBox title="Duração" value={movie.duration} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MetricBox title="Situação" value={movie.status} />
                  <MetricBox title="Idioma" value={movie.language} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <MetricBox title="Orçamento" value={formatMoney(movie.budget)} />
                  <MetricBox
                    title="Receita"
                    value={movie.revenue ? formatMoney(movie.revenue) : 'N/A'}
                  />
                  <MetricBox
                    title="Lucro"
                    value={movie.profit ? formatMoney(movie.profit) : 'N/A'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {movie.trailerUrl && (
        <main className="relative z-10 mx-auto w-full px-6 md:px-12 lg:px-24 mt-12">
          <h2 className="mb-6 text-[22px] font-bold text-white">Trailer</h2>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-2xl border border-white/5 bg-black">
            <iframe
              src={getEmbedUrl(movie.trailerUrl) || ''}
              title={`Trailer de ${movie.title}`}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </main>
      )}
    </div>
  );
}
