import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Resend } from 'resend';

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null
})
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
export const emailQueue = new Queue('movie-release-emails', { connection });
export const emailWorker = new Worker('movie-release-emails', async (job) => {
  const { userEmail, userName, movieTitle } = job.data;
  console.log(`✉️ Enviando e-mail de estreia para ${userEmail}...`);

  if (resend) {
        try {
          const {data} = await resend.emails.send({
            from: 'Cubos Movies <onboarding@resend.dev>',
            to: userEmail,
            subject: `Lembrete: O filme ${movieTitle} estreia hoje! 🍿`,
            html: `<p>Olá, <strong>${userName}</strong>!</p>
                   <p>O filme <strong>${movieTitle}</strong> que você cadastrou acaba de ser lançado.</p>
                   <p>Acesse o Cubos Movies para conferir e não perca a estreia!</p>`,
          });
          console.log(`✅ E-mail enviado com sucesso! ID do disparo:`, data?.id);
        } catch (error) {
          console.error(`❌ Falha na API do Resend:`, error);
        }
      } else {
        console.log(`⚠️ Chave do Resend não encontrada. Simulando envio para ${userEmail}`);
      }
}, { connection })

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Erro ao enviar e-mail (Job ${job?.id}):`, err);
});
