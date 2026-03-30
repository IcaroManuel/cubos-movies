import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useState, useEffect } from 'react';
import { editMovieSchema } from '../../../schemas/editMovieSchema';
import { Input } from '../components/Input';
import { InputImage } from '../components/InputImage';
import { useMovie, type EditMovieForm } from '../hooks/useMovie';

export function EditMovie() {
  const { id } = useParams<{ id: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { editMovie } = useMovie();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditMovieForm>({
    resolver: zodResolver(editMovieSchema) as any,
  });

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (movie) {
      const formattedDate = new Date(movie.releaseDate).toISOString().split('T')[0];

      reset({
        title: movie.title,
        synopsis: movie.synopsis,
        releaseDate: formattedDate as any,
        duration: movie.duration,
        ageRating: movie.ageRating,
        status: movie.status,
        language: movie.language,
        budget: movie.budget,
        revenue: movie.revenue || 0,
        profit: movie.profit || 0,
        votes: movie.votes || 0,
        score: movie.score || 0,
        genres: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres,
      });
    }
  }, [movie, reset]);

  if (isLoading) return <div className="p-8 text-white">Carregando formulário...</div>;
  if (isError || !movie)
    return <div className="p-8 text-red-400">Erro ao carregar os dados do filme.</div>;

  return (
    <>
      <div className="mt-8 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--mauve-12)]">Editar Filme</h1>
        <Link
          to={`/movies/${id}`}
          className="text-sm text-[var(--mauve-11)] hover:text-white transition-colors"
        >
          Cancelar
        </Link>
      </div>

      <main className="mx-auto max-w-4xl rounded-lg bg-[var(--mauve-2)] p-8 shadow-xl border border-[var(--mauve-4)]">
        <form
          onSubmit={handleSubmit((data) => editMovie(data as EditMovieForm, movie, setSubmitError))}
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Título"
              name="title"
              register={register}
              error={errors.title?.message?.toString()}
            />
            <Input
              label="Data de Lançamento"
              name="releaseDate"
              type="date"
              register={register}
              error={errors.releaseDate?.message?.toString()}
            />
            <Input
              label="Duração"
              name="duration"
              register={register}
              error={errors.duration?.message?.toString()}
            />
            <Input
              label="Classificação"
              name="ageRating"
              register={register}
              error={errors.ageRating?.message?.toString()}
            />
            <Input
              label="Status"
              name="status"
              register={register}
              error={errors.status?.message?.toString()}
            />
            <Input
              label="Idioma"
              name="language"
              register={register}
              error={errors.language?.message?.toString()}
            />
            <Input
              label="Gêneros (Separados por vírgula)"
              name="genres"
              register={register}
              error={errors.genres?.message?.toString()}
            />
            <Input
              label="Votos (Quantidade)"
              name="votes"
              type="number"
              register={register}
              error={errors.votes?.message?.toString()}
            />

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-[var(--mauve-4)] pt-6">
              <Input
                label="Aprovação (%)"
                name="score"
                type="number"
                min="0"
                max="100"
                register={register}
                error={errors.score?.message?.toString()}
              />
              <Input
                label="Orçamento (USD)"
                name="budget"
                type="number"
                step="0.01"
                register={register}
                error={errors.budget?.message?.toString()}
              />
              <Input
                label="Receita (USD)"
                name="revenue"
                type="number"
                step="0.01"
                register={register}
                error={errors.revenue?.message?.toString()}
              />
              <Input
                label="Lucro (USD)"
                name="profit"
                type="number"
                step="0.01"
                register={register}
                error={errors.profit?.message?.toString()}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-[var(--mauve-4)] pt-6">
            <label className="text-sm font-medium text-[var(--mauve-11)]">Sinopse</label>
            <textarea
              {...register('synopsis')}
              rows={4}
              className="rounded bg-[var(--mauve-3)] p-3 text-white border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 border-t border-[var(--mauve-4)] pt-6">
            <InputImage
              label="Novo Pôster (Vertical)"
              name="posterFile"
              register={register}
              error={errors.posterFile?.message?.toString()}
              helperText={
                movie.posterUrl ? 'Deixe em branco para manter a imagem atual.' : undefined
              }
            />
            <InputImage
              label="Nova Imagem de Fundo (Horizontal)"
              name="backgroundFile"
              register={register}
              error={errors.backgroundFile?.message?.toString()}
              helperText={
                movie.backgroundUrl ? 'Deixe em branco para manter o fundo atual.' : undefined
              }
            />
          </div>

          {submitError && <div className="text-red-400 text-sm mt-2">{submitError}</div>}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-[var(--purple-9)] px-8 py-3 font-semibold text-white transition-colors hover:bg-[var(--purple-10)] disabled:opacity-50"
            >
              {isSubmitting ? 'Atualizando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
