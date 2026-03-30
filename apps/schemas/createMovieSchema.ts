import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string(),
  originalTitle: z.string().optional(),
  synopsis: z.string(),
  releaseDate: z.coerce.date(),
  duration: z.string(),
  ageRating: z.string(),
  status: z.string(),
  language: z.string(),
  genres: z.union([z.string(), z.array(z.string())]),
  budget: z.coerce.number(),
  revenue: z.coerce.number().optional(),
  profit: z.coerce.number().optional(),
  votes: z.coerce.number().optional(),
  score: z.coerce.number().min(0).max(100).optional(),
  trailerUrl: z.string().url().optional().or(z.literal('')),
  posterUrl: z.string().url().optional().or(z.literal('')),
  backgroundUrl: z.string().optional(),
  posterFile: z.any().optional(),
  backgroundFile: z.any().optional(),
});
