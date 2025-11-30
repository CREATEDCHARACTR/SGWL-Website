import React from 'react';
import { Invoice, PaymentMethod } from '../types';

interface InvoicePdfTemplateProps {
    invoice: Invoice;
}

const InvoicePdfTemplate: React.FC<InvoicePdfTemplateProps> = ({ invoice }) => {
    // Business Details
    const businessName = "SaulGOOD WEATHER Lowery";
    const businessEmail = "saul@sgwl.tech";
    const businessPhone = "(407) 864-6668";
    const businessWebsite = "www.sgwl.tech";
    const businessLocation = "Virginia Beach, VA";

    return (
        <div className="bg-white p-12 max-w-[800px] mx-auto text-gray-900 font-sans" style={{ width: '800px', minHeight: '1100px' }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                    <p className="text-gray-600 text-lg">#{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-gray-900">{businessName}</h2>
                    <p className="text-gray-600 text-sm">{businessLocation}</p>
                    <p className="text-gray-600 text-sm">{businessEmail}</p>
                    <p className="text-gray-600 text-sm">{businessPhone}</p>
                    <p className="text-gray-600 text-sm">{businessWebsite}</p>
                </div>
            </div>

            {/* Client & Invoice Info */}
            <div className="flex justify-between mb-12">
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                    <p className="font-bold text-lg">{invoice.clientName}</p>
                    <p className="text-gray-600">{invoice.clientEmail}</p>
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <span className="text-gray-600 font-medium mr-4">Date Issued:</span>
                        <span className="font-bold">{new Date(invoice.issuedDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 font-medium mr-4">Due Date:</span>
                        <span className="font-bold">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b-2 border-gray-900">
                        <th className="text-left py-3 font-bold uppercase text-sm">Description</th>
                        <th className="text-right py-3 font-bold uppercase text-sm">Qty</th>
                        <th className="text-right py-3 font-bold uppercase text-sm">Rate</th>
                        <th className="text-right py-3 font-bold uppercase text-sm">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.lineItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                            <td className="py-4 text-gray-800">{item.description}</td>
                            <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                            <td className="py-4 text-right text-gray-600">${item.rate.toFixed(2)}</td>
                            <td className="py-4 text-right font-medium text-gray-900">${item.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Subtotal</span>
                        <span className="font-bold">${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    {invoice.taxRate > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Tax ({invoice.taxRate}%)</span>
                            <span className="font-bold">${invoice.taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between py-4 border-b-2 border-gray-900">
                        <span className="text-xl font-bold">Total</span>
                        <span className="text-xl font-bold text-brand-primary">${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Notes & Payment Info */}
            <div className="grid grid-cols-2 gap-8 border-t border-gray-200 pt-8">
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Notes</h3>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{invoice.notes || "Thank you for your business!"}</p>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Methods</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Zelle:</span> {businessPhone}</p>
                        <p><span className="font-medium">Checks payable to:</span> {businessName}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 text-center text-gray-400 text-xs">
                <p>{businessName} | {businessWebsite} | {businessEmail}</p>
            </div>
        </div>
    );
};

export default InvoicePdfTemplate;
