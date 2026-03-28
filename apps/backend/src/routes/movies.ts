import { z } from "zod";
import { FastifyInstance } from "fastify/types/instance";
import { isFuture, differenceInMilliseconds } from 'date-fns';

import { prisma } from "../lib/prisma";
import { verifyJwt } from "../midlewares/verify-jwt";
import { uuidSchema } from "../schemas/uuidSchema";
import { updateMovieSchema } from "../schemas/updateMovieSchema";
import { createMovieSchema } from "../schemas/createMovieSchema";
import { emailQueue } from '../lib/queue';

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

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && isFuture(data.releaseDate)) {
      const delay = differenceInMilliseconds(data.releaseDate, new Date());
      await emailQueue.add(
        'send-release-email',
        {
          userEmail: user.email,
          userName: user.name,
          movieTitle: movie.title,
        },
        { delay }
      );

      console.log(`⏰ E-mail agendado para o filme ${movie.title} em ${data.releaseDate}`);
    }

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
