
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white/60 dark:bg-black/30 backdrop-blur-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 sm:rounded-2xl ${className}`}>
      {children}
    </div>
  );
};

export default Card;
