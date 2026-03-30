import { useNavigate } from 'react-router-dom';
import type { UseFormSetError } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../lib/api';

import { registerSchema } from '../../../schemas/registerSchema';
import { loginSchema } from '../../../schemas/loginSchema';

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;

export function useAuth() {
  const navigate = useNavigate();

  async function login(data: LoginForm, setError: UseFormSetError<LoginForm>) {
    try {
      const response = await api.post('/auth/login', data);

      localStorage.setItem('@cubos-movies:token', response.data.token);

      navigate('/movies');
    } catch (error) {
      setError('root', {
        message: 'Credenciais inválidas. Verifique seu e-mail e senha.',
      });
    }
  }

  async function registerUser(data: RegisterForm, setError: UseFormSetError<RegisterForm>) {
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate('/login');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      setError('root', { message: errorMessage });
    }
  }

  return { login, registerUser };
}
