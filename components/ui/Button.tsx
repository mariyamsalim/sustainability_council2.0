
import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'px-6 py-3 font-semibold rounded-[var(--radius-pill)] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] focus:ring-[var(--primary)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] hover:-translate-y-0.5',
    secondary: 'bg-[var(--bg-card)] text-[var(--text)] border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-slate-700 focus:ring-[var(--primary)]',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${(isLoading || disabled) ? disabledClasses : ''}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
