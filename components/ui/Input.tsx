
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>}
      <input
        id={id}
        className={`block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-base p-3 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;