import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { createMovieSchema } from '../../../schemas/createMovieSchema';
import type z from 'zod';
import type { editMovieSchema } from '../../../schemas/editMovieSchema';
import type { Movie } from '../dtos/movies';
import { useQueryClient } from '@tanstack/react-query';

export type CreateMovieForm = z.infer<typeof createMovieSchema>;
export type EditMovieForm = z.infer<typeof editMovieSchema>;

export function useMovie() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function createMovie(
    data: CreateMovieForm,
    setSubmitError: React.Dispatch<React.SetStateAction<string | null>>,
  ) {
    try {
      setSubmitError(null);
      let posterUrl = '';
      let backgroundUrl = '';

      const pFile = data.posterFile?.[0];
      if (pFile) {
        const formData = new FormData();
        formData.append('file', pFile);
        const uploadResponse = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        posterUrl = uploadResponse.data.posterUrl;
      }

      const bFile = data.backgroundFile?.[0];
      if (bFile) {
        const formData = new FormData();
        formData.append('file', bFile);
        const uploadResponse = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        backgroundUrl = uploadResponse.data.backgroundUrl;
      }

      const genresArray =
        typeof data.genres === 'string'
          ? data.genres
              .split(',')
              .map((g) => g.trim())
              .filter(Boolean)
          : data.genres;

      await api.post('/movies', {
        title: data.title,
        originalTitle: data.originalTitle ?? data.title,
        synopsis: data.synopsis,
        releaseDate: new Date(data.releaseDate).toISOString(),
        duration: data.duration,
        ageRating: data.ageRating,
        status: data.status,
        language: data.language,
        budget: data.budget,
        revenue: data.revenue || 0,
        profit: data.profit || 0,
        votes: data.votes || 0,
        score: data.score || 0,
        genres: genresArray,
        posterUrl: posterUrl || undefined,
        backgroundUrl: backgroundUrl || undefined,
      });

      navigate('/movies');
    } catch (error: any) {
      console.error(error);
      setSubmitError('Erro ao salvar o filme. Tente novamente.');
    }
  }

  async function editMovie(
    data: EditMovieForm,
    movie: Movie,
    setSubmitError: React.Dispatch<React.SetStateAction<string | null>>,
  ) {
    try {
      setSubmitError(null);
      let posterUrl = movie.posterUrl;
      let backgroundUrl = movie.backgroundUrl;

      const pFile = data.posterFile?.[0];
      if (pFile) {
        const formData = new FormData();
        formData.append('file', pFile);
        const uploadResponse = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        posterUrl = uploadResponse.data.posterUrl;
      }

      const bFile = data.backgroundFile?.[0];
      if (bFile) {
        const formData = new FormData();
        formData.append('file', bFile);
        const uploadResponse = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        backgroundUrl = uploadResponse.data.backgroundUrl;
      }

      const genresArray =
        typeof data.genres === 'string'
          ? data.genres
              .split(',')
              .map((g) => g.trim())
              .filter(Boolean)
          : data.genres;

      await api.put(`/movies/${movie.id}`, {
        title: data.title,
        originalTitle: data.originalTitle ?? data.title,
        synopsis: data.synopsis,
        releaseDate: new Date(data.releaseDate).toISOString(),
        duration: data.duration,
        ageRating: data.ageRating,
        status: data.status,
        language: data.language,
        budget: data.budget,
        revenue: data.revenue || 0,
        profit: data.profit || 0,
        votes: data.votes || 0,
        score: data.score || 0,
        genres: genresArray,
        posterUrl: posterUrl || undefined,
        backgroundUrl: backgroundUrl || undefined,
      });

      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['movie', movie.id] });

      navigate(`/movies/${movie.id}`);
    } catch (error: any) {
      console.error(error);
      setSubmitError('Erro ao atualizar o filme. Tente novamente.');
    }
  }

  return { createMovie, editMovie };
}
