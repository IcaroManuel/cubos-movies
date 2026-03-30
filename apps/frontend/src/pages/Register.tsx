import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../../schemas/registerSchema';
import { Input } from '../components/Input';
import { type RegisterForm, useAuth } from '../hooks/useAuth';

export function Register() {
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="relative flex flex-1 w-full flex-col bg-[var(--mauve-1)]">
      <div
        className="absolute inset-x-0 top-0 h-[60vh] bg-cover bg-[center_top_-150px] bg-no-repeat opacity-20 grayscale"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--mauve-1)]/30 to-[var(--mauve-1)]" />
      </div>

      <main className="relative flex flex-1 items-center justify-center p-4">
        <form
          onSubmit={handleSubmit((data) => registerUser(data, setError))}
          className="w-full max-w-[400px] rounded-lg bg-[var(--mauve-2)] p-8 shadow-2xl border border-[var(--mauve-4)] flex flex-col gap-4"
        >
          <Input
            label="Nome"
            name="name"
            type="text"
            placeholder="Digite seu nome"
            register={register}
            error={errors.name?.message}
          />

          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
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

          <Input
            label="Confirmação de senha"
            name="confirmPassword"
            type="password"
            placeholder="Digite sua senha novamente"
            register={register}
            error={errors.confirmPassword?.message}
          />

          {errors.root && (
            <div className="rounded bg-red-500/20 p-3 text-sm text-red-400 border border-red-500/50">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded bg-[var(--purple-9)] p-3 font-semibold text-white transition-colors hover:bg-[var(--purple-10)] disabled:opacity-50"
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </main>

      <footer className="relative py-6 text-center text-sm text-[var(--mauve-11)]">
        {new Date().getFullYear()} © Todos os direitos reservados a Cubos Movies
      </footer>
    </div>
  );
}
