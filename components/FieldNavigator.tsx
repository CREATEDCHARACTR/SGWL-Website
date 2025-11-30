import React from 'react';

interface FieldNavigatorProps {
  totalFields: number;
  completedFields: number;
  onNext: () => void;
}

const FieldNavigator: React.FC<FieldNavigatorProps> = ({ totalFields, completedFields, onNext }) => {
  const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  const isComplete = completedFields === totalFields;

  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] dark:border-t dark:border-gray-700">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex-grow">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {completedFields} of {totalFields} required fields completed
          </p>
          <div className="w-full sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
            <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {isComplete ? 'Finish' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default FieldNavigator;