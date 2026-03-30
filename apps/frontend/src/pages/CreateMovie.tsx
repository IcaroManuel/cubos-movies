import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { createMovieSchema } from '../../../schemas/createMovieSchema';
import { Input } from '../components/Input';
import { InputImage } from '../components/InputImage';
import { Link } from 'react-router-dom';
import { useMovie, type CreateMovieForm } from '../hooks/useMovie';

export function CreateMovie() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { createMovie } = useMovie();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateMovieForm>({
    resolver: zodResolver(createMovieSchema) as any,
  });

  return (
    <>
      <div className="mt-8 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--mauve-12)]">Cadastrar Novo Filme</h1>
        <Link
          to="/movies"
          className="text-sm text-[var(--mauve-11)] hover:text-white transition-colors"
        >
          Cancelar
        </Link>
      </div>

      <main className="mx-auto max-w-4xl rounded-lg bg-[var(--mauve-2)] p-8 shadow-xl border border-[var(--mauve-4)]">
        <form
          onSubmit={handleSubmit((data) => createMovie(data as CreateMovieForm, setSubmitError))}
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Título"
              name="title"
              register={register}
              placeholder="Ex: Vingadores"
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
              placeholder="Ex: 2h 15m"
              error={errors.duration?.message?.toString()}
            />
            <Input
              label="Classificação"
              name="ageRating"
              register={register}
              placeholder="Ex: 14 anos"
              error={errors.ageRating?.message?.toString()}
            />
            <Input
              label="Status"
              name="status"
              register={register}
              placeholder="Ex: Lançado"
              error={errors.status?.message?.toString()}
            />
            <Input
              label="Idioma"
              name="language"
              register={register}
              placeholder="Ex: Inglês"
              error={errors.language?.message?.toString()}
            />
            <Input
              label="Gêneros (Separados por vírgula)"
              name="genres"
              register={register}
              placeholder="Ex: Ação, Aventura"
              error={errors.genres?.message?.toString()}
            />
            <Input
              label="Votos (Quantidade)"
              name="votes"
              type="number"
              register={register}
              placeholder="Ex: 5704"
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
                placeholder="Ex: 67"
                error={errors.score?.message?.toString()}
              />
              <Input
                label="Orçamento (USD)"
                name="budget"
                type="number"
                step="0.01"
                register={register}
                placeholder="Ex: 135000000"
                error={errors.budget?.message?.toString()}
              />
              <Input
                label="Receita (USD)"
                name="revenue"
                type="number"
                step="0.01"
                register={register}
                placeholder="Ex: 467990000"
                error={errors.revenue?.message?.toString()}
              />
              <Input
                label="Lucro (USD)"
                name="profit"
                type="number"
                step="0.01"
                register={register}
                placeholder="Ex: 332990000"
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
              placeholder="Digite a sinopse..."
            />
          </div>

          {/* SEÇÃO 4: UPLOAD DE IMAGENS (Mantido Input File customizado) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 border-t border-[var(--mauve-4)] pt-6">
            <InputImage
              label="Pôster do Filme (Vertical)"
              name="posterFile"
              register={register}
              error={errors.posterFile?.message?.toString()}
            />
            <InputImage
              label="Imagem de Fundo (Horizontal)"
              name="backgroundFile"
              register={register}
              error={errors.backgroundFile?.message?.toString()}
            />
          </div>

          {submitError && <div className="text-red-400 text-sm mt-2">{submitError}</div>}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-[var(--purple-9)] px-8 py-3 font-semibold text-white transition-colors hover:bg-[var(--purple-10)] disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Filme'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
