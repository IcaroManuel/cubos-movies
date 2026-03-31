import { FastifyInstance } from 'fastify';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../lib/cloudflare';
import crypto from 'node:crypto';
import { extname } from 'node:path';
import { verifyJwt } from '../middlewares/verify-jwt';

export async function uploadRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJwt);

  app.post('/', async (request, reply) => {
    const upload = await request.file();
    if (!upload) {
      return reply.status(400).send({ message: 'Nenhum arquivo enviado.' });
    }

    const mimeTypeRegex = /^(image)\/[a-zA-Z]+/;
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);
    if (!isValidFileFormat) {
      return reply.status(400).send({ message: 'Formato de arquivo inválido.' });
    }
    const fileId = crypto.randomUUID();
    const extension = extname(upload.filename);
    const fileName = `${fileId}${extension}`;

    const buffer = await upload.toBuffer();
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: upload.mimetype,
    });
    await r2.send(command);
    const fileUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;

    return reply.status(201).send({ fileUrl });
  });
}
