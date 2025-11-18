
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-[var(--bg-card)] p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--border)] transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
