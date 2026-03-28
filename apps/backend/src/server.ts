import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { authRoutes } from './routes/auth';
import fastifyJwt from '@fastify/jwt';
import { moviesRoutes } from './routes/movies';
import fastifyMultipart from '@fastify/multipart';
import { uploadRoutes } from './routes/upload';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
})
app.register(fastifyMultipart);

app.register(authRoutes, {prefix: '/auth'});
app.register(moviesRoutes, { prefix: '/movies' })
app.register(uploadRoutes, { prefix: '/upload' })


app.listen({port: 3333, host: '0.0.0.0'}).then(() => {
  console.log('🚀 Servidor HTTP rodando na porta 3333!');
});
