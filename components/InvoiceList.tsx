import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Invoice, InvoiceStatus } from '../types';
import { getInvoices, deleteInvoice } from '../services/geminiService';
import Button from './ui/Button';
import Card from './ui/Card';

const getStatusClasses = (status: InvoiceStatus): string => {
    const statusMap: Record<InvoiceStatus, string> = {
        [InvoiceStatus.DRAFT]: 'bg-gray-200/80 text-gray-700',
        [InvoiceStatus.SENT]: 'bg-blue-500/20 text-blue-600',
        [InvoiceStatus.VIEWED]: 'bg-purple-500/20 text-purple-600',
        [InvoiceStatus.PAID]: 'bg-green-500/20 text-green-600',
        [InvoiceStatus.OVERDUE]: 'bg-red-500/20 text-red-600',
        [InvoiceStatus.CANCELLED]: 'bg-gray-400/20 text-gray-500',
    };
    return statusMap[status] ?? 'bg-gray-200 text-gray-800';
};

const InvoiceList: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'dueDate' | 'amount' | 'client'>('dueDate');

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        setLoading(true);
        const data = await getInvoices();
        setInvoices(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            await deleteInvoice(id);
            loadInvoices();
        }
    };

    // Filter and sort
    const filteredInvoices = invoices.filter(inv => {
        if (filterStatus === 'all') return true;
        return inv.status === filterStatus;
    });

    const sortedInvoices = [...filteredInvoices].sort((a, b) => {
        switch (sortBy) {
            case 'dueDate':
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            case 'amount':
                return b.total - a.total;
            case 'client':
                return a.clientName.localeCompare(b.clientName);
            default:
                return 0;
        }
    });

    // Calculate metrics
    const outstandingInvoices = invoices.filter(inv =>
        [InvoiceStatus.SENT, InvoiceStatus.VIEWED, InvoiceStatus.OVERDUE].includes(inv.status)
    );
    const overdueInvoices = invoices.filter(inv => inv.status === InvoiceStatus.OVERDUE);
    const totalOutstanding = outstandingInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

    if (loading) {
        return <div className="text-center p-8">Loading invoices...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
                <Link to="/invoices/new">
                    <Button>+ Create Invoice</Button>
                </Link>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <div className="p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Invoices</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{invoices.length}</div>
                    </div>
                </Card>
                <Card>
                    <div className="p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Outstanding</div>
                        <div className="text-2xl font-bold text-blue-600">{outstandingInvoices.length}</div>
                        <div className="text-xs text-gray-500">${totalOutstanding.toLocaleString()}</div>
                    </div>
                </Card>
                <Card>
                    <div className="p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Overdue</div>
                        <div className="text-2xl font-bold text-red-600">{overdueInvoices.length}</div>
                        <div className="text-xs text-gray-500">${totalOverdue.toLocaleString()}</div>
                    </div>
                </Card>
                <Card>
                    <div className="p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Paid This Month</div>
                        <div className="text-2xl font-bold text-green-600">
                            {invoices.filter(inv =>
                                inv.status === InvoiceStatus.PAID &&
                                inv.paidDate &&
                                new Date(inv.paidDate).getMonth() === new Date().getMonth()
                            ).length}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="p-4 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as InvoiceStatus | 'all')}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                            <option value="all">All Statuses</option>
                            <option value={InvoiceStatus.DRAFT}>Draft</option>
                            <option value={InvoiceStatus.SENT}>Sent</option>
                            <option value={InvoiceStatus.VIEWED}>Viewed</option>
                            <option value={InvoiceStatus.PAID}>Paid</option>
                            <option value={InvoiceStatus.OVERDUE}>Overdue</option>
                            <option value={InvoiceStatus.CANCELLED}>Cancelled</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'amount' | 'client')}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                            <option value="dueDate">Due Date</option>
                            <option value="amount">Amount</option>
                            <option value="client">Client</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Invoice Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {sortedInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No invoices found. <Link to="/invoices/new" className="text-brand-primary hover:underline">Create your first invoice</Link>.
                                    </td>
                                </tr>
                            ) : (
                                sortedInvoices.map(invoice => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {invoice.invoiceNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {invoice.clientName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                            ${invoice.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {new Date(invoice.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link to={`/invoices/${invoice.id}`}>
                                                <Button variant="secondary" className="!py-1 !px-3 text-xs">View</Button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(invoice.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default InvoiceList;
