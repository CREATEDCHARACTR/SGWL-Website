import React from 'react';

interface FieldNavigatorProps {
  totalFields: number;
  completedFields: number;
  onNext: () => void;
}

const FieldNavigator: React.FC<FieldNavigatorProps> = ({ totalFields, completedFields, onNext }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  const isComplete = completedFields === totalFields;

  return (
    <div className={`sticky bottom-0 bg-white dark:bg-gray-800 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] dark:border-t dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
      <div className="absolute -top-10 right-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-white dark:bg-gray-800 p-2 rounded-t-lg shadow-[0_-2px_5px_rgba(0,0,0,0.1)] border border-b-0 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-brand-primary"
          aria-label={isCollapsed ? "Expand signing bar" : "Collapse signing bar"}
        >
          {isCollapsed ? (
            // Chevron Up
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          ) : (
            // Chevron Down
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          )}
        </button>
      </div>

      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className={`flex-grow ${isCollapsed ? 'hidden sm:block' : ''}`}>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {completedFields} of {totalFields} required fields completed
          </p>
          <div className="w-full sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
            <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {isCollapsed ? (
          <div className="flex-grow sm:hidden flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{Math.round(progress)}% Complete</span>
            <button onClick={() => setIsCollapsed(false)} className="text-brand-primary text-sm font-semibold">Show Controls</button>
          </div>
        ) : (
          <button
            onClick={onNext}
            disabled={!isComplete}
            className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isComplete ? 'Finish' : 'Finish'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FieldNavigator;