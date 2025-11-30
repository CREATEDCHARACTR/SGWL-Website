import React from 'react';
import { AnalyticsData } from '../../types';
import Card from '../ui/Card';
import StatCard from './StatCard';
import LineChart from '../charts/LineChart';
import ProgressBar from '../ui/ProgressBar';

interface AnalyticsOverviewTabProps {
    analyticsData: AnalyticsData;
}

const AnalyticsOverviewTab: React.FC<AnalyticsOverviewTabProps> = ({ analyticsData }) => {
    const { revenue, clients, contracts, sessions, goals } = analyticsData;

    const revenueGrowth = revenue.previous > 0 ? ((revenue.current - revenue.previous) / revenue.previous) * 100 : 0;

    const totalServiceRevenue = revenue.byService.reduce((sum, service) => sum + service.value, 0);
    const totalClientsBySource = clients.bySource.reduce((sum, source) => sum + source.count, 0);

    const activeGoals = Object.values(goals);

    return (
        <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="This Period's Revenue" value={`$${revenue.current.toLocaleString()}`} change={revenueGrowth} />
                <StatCard title="All-Time Revenue" value={`$${revenue.allTime.toLocaleString()}`} />
                <StatCard title="Total Clients" value={clients.total.toString()} />
                <StatCard title="Avg. Revenue/Client" value={`$${revenue.averagePerClient.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            </div>

            {/* Revenue Trend Chart */}
            <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Revenue Trend (Last 12 Months)</h3>
                <div className="h-64">
                    <LineChart data={revenue.trend.map(d => ({ label: d.month, value: d.revenue }))} />
                </div>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Business Metrics */}
                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Business Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard title="Active Contracts" value={contracts.active.toString()} />
                        <StatCard title="Pending Contracts" value={contracts.pending.toString()} />
                        <StatCard title="New Clients (Period)" value={clients.newInPeriod.toString()} />
                        <StatCard title="Sessions (Period)" value={`${sessions.completedInPeriod} Done / ${sessions.upcomingInPeriod} Upcoming`} />
                    </div>
                </Card>
                
                 {/* Goals Tracker */}
                {activeGoals.length > 0 && (
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold mb-4 dark:text-white">Goals Tracker</h3>
                        <div className="space-y-4">
                            {/* Fix: Use Object.keys to iterate, ensuring 'goal' is correctly typed. */}
                            {Object.keys(goals).map((id) => {
                                const goal = goals[id];
                                return (
                                    <div key={id}>
                                        <div className="flex justify-between text-sm font-medium mb-1">
                                            <span className="dark:text-gray-200">Goal</span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                                            </span>
                                        </div>
                                        <ProgressBar value={goal.current} max={goal.target} />
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Services */}
                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Top Services (This Period)</h3>
                    <div className="space-y-4">
                        {revenue.byService.length > 0 ? revenue.byService.map(service => (
                            <div key={service.name}>
                                <div className="flex justify-between text-sm font-medium mb-1">
                                    <span className="dark:text-gray-200">{service.name}</span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        ${service.value.toLocaleString()} ({totalServiceRevenue > 0 ? ((service.value / totalServiceRevenue) * 100).toFixed(0) : 0}%)
                                    </span>
                                </div>
                                <ProgressBar value={service.value} max={totalServiceRevenue} />
                            </div>
                        )) : <p className="text-gray-500">No revenue in this period.</p>}
                    </div>
                </Card>

                {/* Client Acquisition */}
                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Client Acquisition (This Period)</h3>
                     <div className="space-y-4">
                        {clients.bySource.length > 0 ? clients.bySource.map(source => (
                            <div key={source.name}>
                                <div className="flex justify-between text-sm font-medium mb-1">
                                    <span className="dark:text-gray-200">{source.name}</span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {source.count} client{source.count !== 1 ? 's' : ''} ({totalClientsBySource > 0 ? ((source.count / totalClientsBySource) * 100).toFixed(0) : 0}%)
                                    </span>
                                </div>
                                <ProgressBar value={source.count} max={totalClientsBySource} />
                            </div>
                        )) : <p className="text-gray-500">No new clients in this period.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsOverviewTab;