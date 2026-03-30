import { z } from 'zod';
export declare const createMovieSchema: z.ZodObject<
  {
    title: z.ZodString;
    originalTitle: z.ZodOptional<z.ZodString>;
    synopsis: z.ZodString;
    releaseDate: z.ZodCoercedDate<unknown>;
    duration: z.ZodString;
    ageRating: z.ZodString;
    status: z.ZodString;
    language: z.ZodString;
    genres: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
    budget: z.ZodCoercedNumber<unknown>;
    revenue: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    profit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    votes: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    score: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    trailerUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<''>]>;
    posterUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<''>]>;
    backgroundUrl: z.ZodOptional<z.ZodString>;
    posterFile: z.ZodOptional<z.ZodAny>;
    backgroundFile: z.ZodOptional<z.ZodAny>;
  },
  z.core.$strip
>;
//# sourceMappingURL=createMovieSchema.d.ts.map
