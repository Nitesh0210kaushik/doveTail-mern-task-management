import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-4 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 focus:ring-blue-100',
        outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-800'
      },
      size: {
        default: 'px-5 py-3',
        full: 'w-full px-4 py-3.5'
      }
    },
    defaultVariants: { variant: 'primary', size: 'default' }
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
