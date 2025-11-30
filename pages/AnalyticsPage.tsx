import React, { useState, useEffect } from 'react';
import { fetchClients, getContracts, fetchAllSessions, fetchGoals } from '../services/geminiService';
import { Client, Contract, Session, DateRangeFilter, AnalyticsData, Goal } from '../types';
import { calculateAnalytics } from '../services/analyticsService';
import AnalyticsOverviewTab from '../components/analytics/AnalyticsOverviewTab';
import GoalsTab from '../components/analytics/GoalsTab';
import ReportsTab from '../components/analytics/ReportsTab';
import InsightsTab from '../components/analytics/InsightsTab';

type Tab = 'overview' | 'reports' | 'goals' | 'insights';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-base font-medium transition-colors rounded-t-lg focus:outline-none ${
            active
                ? 'border-b-2 border-brand-primary text-brand-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
    >
        {children}
    </button>
);

const AnalyticsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [dateRange, setDateRange] = useState<DateRangeFilter>('month');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [contracts, clients, sessions, goalsData] = await Promise.all([
                getContracts(),
                fetchClients(),
                fetchAllSessions(),
                fetchGoals()
            ]);
            setGoals(goalsData);
            const data = calculateAnalytics(contracts, clients, sessions, goalsData, dateRange);
            setAnalyticsData(data);
        } catch (error) {
            console.error("Failed to load analytics data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [dateRange]);

    const renderTabContent = () => {
        if (isLoading || !analyticsData) {
            return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Calculating analytics...</div>;
        }

        switch (activeTab) {
            case 'overview':
                return <AnalyticsOverviewTab analyticsData={analyticsData} />;
            case 'goals':
                return <GoalsTab goals={goals} analyticsData={analyticsData} onGoalUpdate={loadData} />;
            case 'reports':
                return <ReportsTab />;
            case 'insights':
                return <InsightsTab />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">📊 Business Analytics</h1>
                <div className="flex items-center gap-2">
                    {(['month', 'year', 'all'] as DateRangeFilter[]).map(range => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                dateRange === range 
                                    ? 'bg-brand-primary text-white' 
                                    : 'bg-white/60 dark:bg-black/30 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            {range === 'month' ? 'This Month' : range === 'year' ? 'This Year' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
                    <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>Reports</TabButton>
                    <TabButton active={activeTab === 'goals'} onClick={() => setActiveTab('goals')}>Goals</TabButton>
                    <TabButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')}>Insights</TabButton>
                </nav>
            </div>

            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AnalyticsPage;