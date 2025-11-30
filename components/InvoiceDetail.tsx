import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Invoice, InvoiceStatus, PaymentMethod, AuditEventType } from '../types';
import { getInvoiceById, updateInvoice } from '../services/geminiService';
import { downloadInvoicePdf } from '../services/pdfService';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import SEO from './SEO';

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

const InvoiceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CARD);
    const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        loadInvoice();
    }, [id]);

    const loadInvoice = async () => {
        const data = await getInvoiceById(id);
        setInvoice(data);
    };

    const handleSendEmail = () => {
        if (!invoice) return;

        const subject = `Invoice #${invoice.invoiceNumber} from SaulGOOD WEATHER Lowery`;
        const body = `Dear ${invoice.clientName},

I hope this email finds you well.

Please find attached the invoice for recent services rendered.

**Invoice Details:**
• Invoice #: ${invoice.invoiceNumber}
• Issue Date: ${new Date(invoice.issuedDate).toLocaleDateString()}
• Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
• Amount Due: $${invoice.total.toFixed(2)}

**Payment Options:**
We accept the following payment methods for your convenience:
• Zelle: (407) 864-6668
• Cash or Check

${invoice.notes || ''}

Thank you for your business!

Best regards,
Saul Lowery
SaulGOOD WEATHER Lowery
saul@sgwl.tech | (407) 864-6668`;

        const mailto = `mailto:${invoice.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;

        // Update status to SENT
        if (invoice.status === InvoiceStatus.DRAFT) {
            const updatedInvoice = {
                ...invoice,
                status: InvoiceStatus.SENT,
                updatedAt: new Date().toISOString(),
                auditTrail: [...invoice.auditTrail, {
                    id: `aud_${Date.now()}`,
                    eventType: AuditEventType.SENT,
                    createdAt: new Date().toISOString(),
                    meta: { to: invoice.clientEmail }
                }]
            };
            updateInvoice(updatedInvoice);
            setInvoice(updatedInvoice);
        }
    };

    const handleMarkAsPaid = async () => {
        if (!invoice) return;

        const now = new Date().toISOString();
        const updatedInvoice: Invoice = {
            ...invoice,
            status: InvoiceStatus.PAID,
            paymentMethod,
            paidDate: new Date(paidDate).toISOString(),
            transactionId: transactionId || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            updatedAt: now,
            auditTrail: [...invoice.auditTrail, {
                id: `aud_${Date.now()}`,
                eventType: AuditEventType.SIGNED, // Reusing SIGNED for payment received
                createdAt: now,
                meta: {
                    paymentMethod,
                    amount: invoice.total,
                    transactionId: transactionId || 'Auto-Generated'
                }
            }]
        };

        await updateInvoice(updatedInvoice);
        setInvoice(updatedInvoice);
        setShowPaymentModal(false);
    };

    if (invoice === undefined) {
        return <div className="text-center p-8">Loading invoice...</div>;
    }

    if (invoice === null) {
        return <div className="text-center p-8">Invoice not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <SEO title={`Invoice #${invoice.invoiceNumber} - SaulGOOD WEATHER Lowery`} />
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Invoice {invoice.invoiceNumber}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Issued: {new Date(invoice.issuedDate).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => navigate('/invoices')}>
                        Back to Invoices
                    </Button>
                    <Button variant="secondary" onClick={() => invoice && downloadInvoicePdf(invoice)}>
                        📄 Download PDF
                    </Button>
                    {invoice.status !== InvoiceStatus.PAID && invoice.status !== InvoiceStatus.CANCELLED && (
                        <>
                            <Button onClick={handleSendEmail}>
                                📧 Send Email
                            </Button>
                            <Button onClick={() => setShowPaymentModal(true)}>
                                ✓ Mark as Paid
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Status and Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Status</h2>
                        <div>
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(invoice.status)}`}>
                                {invoice.status}
                            </span>
                        </div>
                        {invoice.status === InvoiceStatus.PAID && invoice.paidDate && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>Paid on: {new Date(invoice.paidDate).toLocaleDateString()}</p>
                                <p>Method: {invoice.paymentMethod}</p>
                                {invoice.transactionId && <p>Transaction ID: {invoice.transactionId}</p>}
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <div className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Client</h2>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p className="font-medium">{invoice.clientName}</p>
                            <p>{invoice.clientEmail}</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-600 dark:text-gray-400">Due Date:</p>
                            <p className={`font-medium ${new Date(invoice.dueDate) < new Date() && invoice.status !== InvoiceStatus.PAID ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                                {new Date(invoice.dueDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Line Items */}
            <Card>
                <div className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Items</h2>
                    <table className="w-full">
                        <thead className="border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Description</th>
                                <th className="text-right py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Qty</th>
                                <th className="text-right py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Rate</th>
                                <th className="text-right py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {invoice.lineItems.map(item => (
                                <tr key={item.id}>
                                    <td className="py-3 text-sm text-gray-900 dark:text-white">{item.description}</td>
                                    <td className="py-3 text-sm text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                                    <td className="py-3 text-sm text-right text-gray-700 dark:text-gray-300">${item.rate.toFixed(2)}</td>
                                    <td className="py-3 text-sm text-right font-medium text-gray-900 dark:text-white">${item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                            <span className="font-medium text-gray-900 dark:text-white">${invoice.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Tax ({invoice.taxRate}%):</span>
                            <span className="font-medium text-gray-900 dark:text-white">${invoice.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-semibold border-t pt-2">
                            <span className="text-gray-900 dark:text-white">Total:</span>
                            <span className="text-brand-primary">${invoice.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Notes */}
            {invoice.notes && (
                <Card>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notes</h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{invoice.notes}</p>
                    </div>
                </Card>
            )}

            {/* Mark as Paid Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Mark Invoice as Paid</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Payment Method *
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value={PaymentMethod.CARD}>Credit/Debit Card</option>
                                    <option value={PaymentMethod.ZELLE}>Zelle</option>
                                    <option value={PaymentMethod.CASH}>Cash</option>
                                    <option value={PaymentMethod.CHECK}>Check</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Payment Date *
                                </label>
                                <Input
                                    type="date"
                                    value={paidDate}
                                    onChange={(e) => setPaidDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Transaction/Receipt ID (Optional)
                                </label>
                                <Input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="e.g., Transaction ID, Check #"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleMarkAsPaid}>
                                Confirm Payment
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceDetail;
