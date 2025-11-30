import React from 'react';
import Card from '../ui/Card';

const InsightCard: React.FC<{ icon: string, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white/60 dark:bg-black/20 p-4 rounded-lg flex items-start gap-4">
        <div className="text-2xl pt-1">{icon}</div>
        <div>
            <h4 className="font-bold dark:text-white">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{children}</p>
        </div>
    </div>
);

const InsightsTab: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card className="p-6">
                 <h3 className="text-xl font-semibold mb-4 dark:text-white">💡 AI-Powered Recommendations</h3>
                 <div className="space-y-4">
                    <InsightCard icon="📈" title="Revenue is up 23% this month!">
                        Your wedding photography bookings are driving growth. Consider raising prices for 2026 weddings.
                    </InsightCard>
                     <InsightCard icon="❄️" title="5 clients haven't booked in 90+ days">
                        Send re-engagement emails to win them back. <a href="#" className="text-brand-primary font-semibold">Send Campaign</a>
                    </InsightCard>
                     <InsightCard icon="🎯" title="You're 80% to your monthly revenue goal">
                        Book 2 more sessions to hit $15,000!
                    </InsightCard>
                 </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Key Metrics & Trends</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• <strong>Average contract value:</strong> $2,450 (↑ 12%)</li>
                    <li>• <strong>Client retention rate:</strong> 68% (book again within 12 months)</li>
                    <li>• <strong>Referral rate:</strong> 31% (18 of 58 clients from referrals)</li>
                    <li>• <strong>Peak months:</strong> May-October (wedding season)</li>
                    <li>• <strong>Slow months:</strong> January-February</li>
                </ul>
            </Card>
            
            <div className="text-center text-sm text-gray-500">
                <p>Full AI insights and trend analysis coming soon.</p>
            </div>
        </div>
    );
};

export default InsightsTab;