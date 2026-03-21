import { type ReactNode } from 'react';

const variantStyles = {
  pass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  fail: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
} as const;

interface BadgeProps {
  variant: 'pass' | 'fail';
  children: ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
