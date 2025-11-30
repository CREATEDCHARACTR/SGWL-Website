import React from 'react';

interface SkeletonProps {
    type: 'card' | 'table' | 'text';
    rows?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ type, rows = 1 }) => {
    const baseClasses = "bg-gray-200 dark:bg-gray-700 rounded animate-pulse";

    if (type === 'card') {
        return (
            <div className="border border-gray-200 dark:border-gray-700 shadow rounded-2xl p-6">
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <div className={`${baseClasses} h-6 w-3/5`}></div>
                        <div className={`${baseClasses} h-6 w-1/5`}></div>
                    </div>
                    <div className={`${baseClasses} h-4 w-4/5`}></div>
                    <div className="flex gap-4">
                        <div className={`${baseClasses} h-4 w-1/4`}></div>
                        <div className={`${baseClasses} h-4 w-1/4`}></div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (type === 'table') {
        return (
            <div className="w-full p-4">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className={`${baseClasses} h-5 w-5 rounded-md`}></div>
                        <div className={`${baseClasses} h-4 flex-grow`}></div>
                        <div className={`${baseClasses} h-4 w-1/4`}></div>
                        <div className={`${baseClasses} h-6 w-16`}></div>
                        <div className={`${baseClasses} h-4 w-1/6`}></div>
                    </div>
                ))}
            </div>
        )
    }

    return <div className={`${baseClasses} h-4 w-full`}></div>;
};

export default Skeleton;
