import { FastifyInstance } from 'fastify/types/instance';
import { isFuture, differenceInMilliseconds } from 'date-fns';

import { prisma } from '../lib/prisma';
import { verifyJwt } from '../midlewares/verify-jwt';
import { createMovieSchema } from '../../../schemas/createMovieSchema';

import { uuidSchema } from '../../../schemas/uuidSchema';

import { emailQueue } from '../lib/queue';

export async function moviesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJwt);

  app.post('/', async (request, reply) => {
    const parsed = createMovieSchema.parse(request.body);
    const userId = request.user.sub;
    const { backgroundFile, posterFile, genres, ...restParsed } = parsed;
    const genresArray =
      typeof genres === 'string'
        ? genres
            .split(',')
            .map((g) => g.trim())
            .filter(Boolean)
        : genres || [];

    const data = {
      ...restParsed,
      genres: genresArray,
      userId,
      originalTitle: restParsed.originalTitle ?? null,
      trailerUrl: restParsed.trailerUrl ?? null,
      posterUrl: restParsed.posterUrl ?? null,
      backgroundUrl: restParsed.backgroundUrl ?? null,
      votes: restParsed.votes ?? 0,
      revenue: restParsed.revenue ?? 0,
      profit: restParsed.profit ?? 0,
      score: restParsed.score ?? 0,
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
        { delay },
      );

      console.log(`⏰ E-mail agendado para o filme ${movie.title} em ${data.releaseDate}`);
    }

    return reply.status(201).send(movie);
  });

  app.get('/', async (request, reply) => {
    const {
      search,
      genre,
      status,
      sort,
      page = '1',
      limit = '10',
    } = request.query as {
      search?: string;
      genre?: string;
      status?: string;
      sort?: string;
      page?: string;
      limit?: string;
    };

    const userId = request.user.sub;
    let orderByConfig: any = { createdAt: 'desc' };

    if (sort === 'score_desc') {
      orderByConfig = { score: 'desc' };
    } else if (sort === 'score_asc') {
      orderByConfig = { score: 'asc' };
    }
    const pageNumber = Number(page);
    const takeNumber = Number(limit);
    const skipNumber = (pageNumber - 1) * takeNumber;

    const whereConfig = {
      userId,
      ...(search ? { title: { contains: search, mode: 'insensitive' as const } } : {}),
      ...(genre ? { genres: { has: genre } } : {}),
      ...(status ? { status: status } : {}),
    };
    const [totalCount, movies] = await Promise.all([
      prisma.movie.count({ where: whereConfig }),
      prisma.movie.findMany({
        where: whereConfig,
        orderBy: orderByConfig,
        skip: skipNumber,
        take: takeNumber,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / takeNumber);

    return reply.send({
      data: movies,
      totalPages: totalPages,
      currentPage: pageNumber,
      totalItems: totalCount,
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
    const parsed = createMovieSchema.parse(request.body);
    const userId = request.user.sub;

    const existingMovie = await prisma.movie.findFirst({
      where: { id, userId },
    });

    if (!existingMovie) {
      return reply.status(404).send({ message: 'Filme não encontrado ou acesso negado.' });
    }

    const { backgroundFile, posterFile, genres, ...restParsed } = parsed;
    const genresArray =
      typeof genres === 'string'
        ? genres
            .split(',')
            .map((g) => g.trim())
            .filter(Boolean)
        : genres || existingMovie.genres;

    const data = {
      ...restParsed,
      genres: genresArray,
      originalTitle: restParsed.originalTitle ?? existingMovie.originalTitle,
      trailerUrl: restParsed.trailerUrl ?? existingMovie.trailerUrl,
      posterUrl: restParsed.posterUrl ?? existingMovie.posterUrl,
      backgroundUrl: restParsed.backgroundUrl ?? existingMovie.backgroundUrl,
      revenue: restParsed.revenue ?? existingMovie.revenue,
      profit: restParsed.profit ?? existingMovie.profit,
      votes: restParsed.votes ?? existingMovie.votes,
      score: restParsed.score ?? existingMovie.score,
    };

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
