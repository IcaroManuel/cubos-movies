import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../schemas/loginSchema';
import { Input } from '../components/Input';
import { useAuth, type LoginForm } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export function Login() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="relative flex flex-1 w-full flex-col bg-[var(--mauve-1)]">
      <div
        className="absolute inset-x-0 top-0 h-[60vh] bg-cover bg-[center_top_-150px] bg-no-repeat opacity-20 grayscale"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--mauve-1)]/30 to-[var(--mauve-1)]" />
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4">
        <form
          onSubmit={handleSubmit((data) => login(data, setError))}
          className="w-full max-w-[400px] rounded-lg bg-[var(--mauve-2)] p-8 shadow-2xl border border-[var(--mauve-4)] flex flex-col gap-4"
        >
          <Input
            label="Nome/E-mail"
            name="email"
            type="text"
            placeholder="Digite seu nome/E-mail"
            register={register}
            error={errors.email?.message}
          />

          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="Digite sua senha"
            register={register}
            error={errors.password?.message}
          />

          {errors.root && (
            <div className="mt-2 rounded bg-red-500/20 p-3 text-sm text-red-400 border border-red-500/50">
              {errors.root.message}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <Link
              to="#"
              className="text-sm text-[var(--purple-10)] underline decoration-[var(--purple-10)] underline-offset-4 transition-colors hover:text-[var(--purple-9)]"
            >
              Esqueci minha senha
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-[var(--purple-9)] px-8 py-2.5 font-semibold text-white transition-colors hover:bg-[var(--purple-10)] disabled:opacity-50"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </main>

      <footer className="relative z-10 py-6 text-center text-sm text-[var(--mauve-11)]">
        {new Date().getFullYear()} © Todos os direitos reservados a Cubos Movies
      </footer>
    </div>
  );
}
