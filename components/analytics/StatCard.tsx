import React from 'react';
import Card from '../ui/Card';

interface StatCardProps {
    title: string;
    value: string;
    change?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change }) => {
    const isPositive = change !== undefined && change >= 0;
    const changeText = change !== undefined ? `${isPositive ? '↑' : '↓'} ${Math.abs(change).toFixed(1)}%` : null;
    const changeColor = change !== undefined ? (isPositive ? 'text-green-500' : 'text-red-500') : '';

    return (
        <Card className="p-4">
            <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
            <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                {changeText && (
                    <span className={`text-sm font-semibold ${changeColor}`}>{changeText}</span>
                )}
            </div>
        </Card>
    );
};

export default StatCard;