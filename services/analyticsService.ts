import { Contract, Client, Session, DateRangeFilter, AnalyticsData, ContractStatus, Goal, GoalType, SessionStatus } from '../types';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, getMonth, getYear, format } from 'date-fns';

const getPeriod = (dateRange: DateRangeFilter) => {
    const now = new Date();
    switch (dateRange) {
        case 'month':
            return { start: startOfMonth(now), end: endOfMonth(now) };
        case 'year':
            return { start: startOfYear(now), end: endOfYear(now) };
        case 'all':
        default:
            return { start: new Date(0), end: now };
    }
};

const isInPeriod = (date: Date, period: { start: Date, end: Date }) => {
    return date >= period.start && date <= period.end;
};

export const calculateAnalytics = (
    contracts: Contract[],
    clients: Client[],
    sessions: Session[],
    goals: Goal[],
    dateRange: DateRangeFilter
): AnalyticsData => {
    const period = getPeriod(dateRange);
    const previousPeriod = getPeriod(dateRange === 'month' ? 'month' : 'year'); // Simplified previous period for growth
    if (dateRange === 'month') {
        previousPeriod.start = startOfMonth(subMonths(new Date(), 1));
        previousPeriod.end = endOfMonth(subMonths(new Date(), 1));
    } else if (dateRange === 'year') {
        previousPeriod.start = startOfYear(subMonths(new Date(), 12));
        previousPeriod.end = endOfYear(subMonths(new Date(), 12));
    }

    const contractsInPeriod = contracts.filter(c => isInPeriod(new Date(c.createdAt), period));
    const clientsInPeriod = clients.filter(c => isInPeriod(new Date(c.meta.createdAt), period));
    const sessionsInPeriod = sessions.filter(s => isInPeriod(new Date(s.sessionDetails.dateTime), period));

    // Revenue
    const currentRevenue = contractsInPeriod
        .filter(c => c.status === ContractStatus.COMPLETED)
        .reduce((sum, c) => sum + Number(c.variables.base_fee || 0), 0);

    const previousRevenue = contracts
        .filter(c => c.status === ContractStatus.COMPLETED && isInPeriod(new Date(c.createdAt), previousPeriod))
        .reduce((sum, c) => sum + Number(c.variables.base_fee || 0), 0);

    const allTimeRevenue = contracts
        .filter(c => c.status === ContractStatus.COMPLETED)
        .reduce((sum, c) => sum + Number(c.variables.base_fee || 0), 0);

    const revenueByService = contractsInPeriod
        .filter(c => c.status === ContractStatus.COMPLETED)
        .reduce((acc, c) => {
            const name = c.contractType;
            const value = Number(c.variables.base_fee || 0);
            const existing = acc.find(s => s.name === name);
            if (existing) {
                existing.value += value;
            } else {
                acc.push({ name, value });
            }
            return acc;
        }, [] as { name: string; value: number }[]).sort((a, b) => b.value - a.value);

    // Revenue Trend (Last 12 months)
    const trend: Array<{ month: string, revenue: number }> = [];
    const twelveMonthsAgo = subMonths(new Date(), 11);
    for (let i = 0; i < 12; i++) {
        const date = new Date(twelveMonthsAgo.getFullYear(), twelveMonthsAgo.getMonth() + i, 1);
        trend.push({ month: format(date, 'MMM'), revenue: 0 });
    }
    contracts.filter(c => c.status === ContractStatus.COMPLETED && new Date(c.createdAt) >= twelveMonthsAgo)
        .forEach(c => {
            const monthIndex = (getMonth(new Date(c.createdAt)) - getMonth(twelveMonthsAgo) + 12) % 12;
            if (trend[monthIndex]) {
                trend[monthIndex].revenue += Number(c.variables.base_fee || 0);
            }
        });

    // Clients
    const bySource = clientsInPeriod.reduce((acc, c) => {
        const source = c.businessInfo.referralSource || 'Other';
        const existing = acc.find(s => s.name === source);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ name: source, count: 1 });
        }
        return acc;
    }, [] as { name: string, count: number }[]).sort((a, b) => b.count - a.count);

    // Goals
    const goalProgress: AnalyticsData['goals'] = {};
    goals.filter(g => g.status === 'active').forEach(goal => {
        let current = 0;
        if (goal.type === GoalType.REVENUE) {
            current = currentRevenue;
        } else if (goal.type === GoalType.CLIENTS) {
            current = clientsInPeriod.length;
        } else if (goal.type === GoalType.SESSIONS) {
            // Fix: Use imported SessionStatus enum
            current = sessionsInPeriod.filter(s => s.status === SessionStatus.COMPLETED).length;
        }
        goalProgress[goal.id] = { current, target: goal.target };
    });

    return {
        revenue: {
            current: currentRevenue,
            previous: previousRevenue,
            allTime: allTimeRevenue,
            averagePerClient: clients.length > 0 ? allTimeRevenue / clients.length : 0,
            trend,
            byService: revenueByService,
        },
        clients: {
            total: clients.length,
            newInPeriod: clientsInPeriod.length,
            bySource: bySource,
        },
        contracts: {
            active: contracts.filter(c => c.status !== ContractStatus.COMPLETED && c.status !== ContractStatus.DECLINED).length,
            pending: contracts.filter(c => c.status === ContractStatus.SENT || c.status === ContractStatus.VIEWED).length,
        },
        sessions: {
            // Fix: Use imported SessionStatus enum
            completedInPeriod: sessionsInPeriod.filter(s => s.status === SessionStatus.COMPLETED).length,
            // Fix: Use imported SessionStatus enum
            upcomingInPeriod: sessionsInPeriod.filter(s => s.status === SessionStatus.CONFIRMED || s.status === SessionStatus.PENDING).length,
        },
        goals: goalProgress
    };
};