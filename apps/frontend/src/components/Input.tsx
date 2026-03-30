import { type InputHTMLAttributes } from 'react';
import type { FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register: UseFormRegister<FieldValues>;
  error?: string;
}

export function Input({ label, name, register, error, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--mauve-11)]">{label}</label>
      <input
        {...register(name)}
        {...rest}
        className="rounded bg-[var(--mauve-3)] p-3 text-white border border-[var(--mauve-6)] focus:border-[var(--purple-9)] outline-none"
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
