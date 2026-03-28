import { z } from "zod";

export const updateMovieSchema = z.object({
  title: z.string(),
  originalTitle: z.string().optional(),
  synopsis: z.string(),
  releaseDate: z.coerce.date(),
  duration: z.string(),
  ageRating: z.string(),
  status: z.string(),
  language: z.string(),
  budget: z.number(),
  genres: z.array(z.string()),
  trailerUrl: z.string().url().optional(),
  posterUrl: z.string().url().optional(),
}).partial();
