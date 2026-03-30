import { z } from 'zod';

export const authSchema = z.object({
  name: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres.'),
  email: z.string().email('Formato de e-mail inválido.'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
});
