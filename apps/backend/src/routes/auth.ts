import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { authSchema } from '../../../schemas/authSchema';
import { prisma } from '../lib/prisma';
import { loginSchema } from '../../../schemas/loginSchema';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const { name, email, password } = authSchema.parse(request.body);
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return reply.status(409).send({ message: 'E-mail já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return reply.status(201).send();
  });

  app.post('/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.isActive) {
      return reply.status(400).send({ message: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return reply.status(400).send({ message: 'Credenciais inválidas.' });
    }

    const token = app.jwt.sign(
      {
        name: user.name,
      },
      {
        sub: user.id,
        expiresIn: '7d',
      },
    );

    return reply.status(200).send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
}
