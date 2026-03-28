import { FastifyInstance } from "fastify/types/instance";
import { verifyJwt } from "../midlewares/verify-jwt";
import { createMovieSchema } from "../schemas/createMovieSchema";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { updateMovieSchema } from "../schemas/updateMovieSchema";
import { uuidSchema } from "../schemas/uuidSchema";

export async function moviesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJwt);

  app.post('/', async (request, reply) => {
    const parsed = createMovieSchema.parse(request.body);
    const userId = request.user.sub;

    const data = {
      ...parsed,
      userId,
      originalTitle: parsed.originalTitle ?? null,
      trailerUrl: parsed.trailerUrl ?? null,
      posterUrl: parsed.posterUrl ?? null,
    };

    const movie = await prisma.movie.create({
      data,
    });

    return reply.status(201).send(movie);
  });

  app.get('/', async (request, reply) => {
    const querySchema = z.object({
      page: z.coerce.number().default(1),
    });
    const { page } = querySchema.parse(request.query);
        const itemsPerPage = 10;
    const movies = await prisma.movie.findMany({
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      orderBy: { createdAt: 'desc' }
    });
    const totalCount = await prisma.movie.count();

    return reply.status(200).send({
          data: movies,
          meta: {
            total: totalCount,
            page,
            lastPage: Math.ceil(totalCount / itemsPerPage),
          },
        });
  });

  app.get('/:id', async (request, reply) => {
      const { id } = uuidSchema.parse(request.params);
      const userId = request.user.sub;
      const movie = await prisma.movie.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!movie) {
        return reply.status(404).send({ message: 'Filme não encontrado ou acesso negado.' });
      }
      return reply.status(200).send(movie);
    });

  app.put('/:id', async (request, reply) => {
      const { id } = uuidSchema.parse(request.params);
      const userId = request.user.sub;
      const movieExists = await prisma.movie.findFirst({
        where: { id, userId },
      });

      if (!movieExists) {
        return reply.status(404).send({ message: 'Filme não encontrado ou acesso negado.' });
      }

      const data = updateMovieSchema.parse(request.body);

      const updatedMovie = await prisma.movie.update({
        where: { id },
        data,
      });

      return reply.status(200).send(updatedMovie);
    });

  app.delete('/:id', async (request, reply) => {
      const { id } = uuidSchema.parse(request.params);
      const userId = request.user.sub;
      const movieExists = await prisma.movie.findFirst({
        where: { id, userId },
      });

      if (!movieExists) {
        return reply.status(404).send({ message: 'Filme não encontrado ou acesso negado.' });
      }
      await prisma.movie.delete({
        where: { id },
      });

      return reply.status(204).send();
    });

}
