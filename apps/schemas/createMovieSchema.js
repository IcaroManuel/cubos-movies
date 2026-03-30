'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createMovieSchema = void 0;
const zod_1 = require('zod');
exports.createMovieSchema = zod_1.z.object({
  title: zod_1.z.string(),
  originalTitle: zod_1.z.string().optional(),
  synopsis: zod_1.z.string(),
  releaseDate: zod_1.z.coerce.date(),
  duration: zod_1.z.string(),
  ageRating: zod_1.z.string(),
  status: zod_1.z.string(),
  language: zod_1.z.string(),
  genres: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
  budget: zod_1.z.coerce.number(),
  revenue: zod_1.z.coerce.number().optional(),
  profit: zod_1.z.coerce.number().optional(),
  votes: zod_1.z.coerce.number().optional(),
  score: zod_1.z.coerce.number().min(0).max(100).optional(),
  trailerUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
  posterUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
  backgroundUrl: zod_1.z.string().optional(),
  posterFile: zod_1.z.any().optional(),
  backgroundFile: zod_1.z.any().optional(),
});
//# sourceMappingURL=createMovieSchema.js.map
