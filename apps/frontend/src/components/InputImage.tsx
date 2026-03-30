import { type InputHTMLAttributes } from 'react';

interface InputImageProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  name: string;
  register: any;
  error?: string;
  helperText?: string;
}

export function InputImage({ label, name, register, error, helperText, ...rest }: InputImageProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--mauve-11)]">{label}</label>
      <input
        type="file"
        accept="image/*"
        {...register(name)}
        {...rest}
        className="text-sm text-[var(--mauve-11)] file:mr-4 file:rounded file:border-0 file:bg-[var(--purple-3)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--purple-11)] hover:file:bg-[var(--purple-4)] cursor-pointer"
      />
      {helperText && <p className="text-xs text-[var(--mauve-9)] mt-1">{helperText}</p>}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
