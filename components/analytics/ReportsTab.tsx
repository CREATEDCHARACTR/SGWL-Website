import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ReportsTab: React.FC = () => {
    return (
        <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Generate Custom Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b dark:border-gray-700 pb-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Report Type</label>
                        <select className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                            <option>Revenue Summary</option>
                            <option>Client Report</option>
                            <option>Service Performance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600" />
                            <input type="date" className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Format</label>
                         <select className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                            <option>PDF</option>
                            <option>CSV</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Include</label>
                    <div className="space-y-2">
                        <div className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded mr-2" defaultChecked /> Revenue by service</div>
                        <div className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded mr-2" defaultChecked /> Client acquisition</div>
                        <div className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded mr-2" /> Top clients</div>
                        <div className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded mr-2" /> Detailed transaction list</div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => alert('Coming soon!')}>Schedule Monthly</Button>
                <Button onClick={() => alert('Report generation coming soon!')}>Generate Report</Button>
            </div>
        </Card>
    );
};

export default ReportsTab;