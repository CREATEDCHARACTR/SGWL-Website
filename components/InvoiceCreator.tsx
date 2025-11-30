import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Invoice, InvoiceStatus, InvoiceLineItem, Client, AuditEventType } from '../types';
import { createInvoice } from '../services/geminiService';
import { fetchClients } from '../services/db';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

const InvoiceCreator: React.FC = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
        { id: `item_1`, description: '', quantity: 1, rate: 0, amount: 0 }
    ]);
    const [dueDate, setDueDate] = useState('');
    const [taxRate, setTaxRate] = useState(0);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadClients();
        // Set default due date to 30 days from now
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 30);
        setDueDate(defaultDueDate.toISOString().split('T')[0]);
    }, []);

    const loadClients = async () => {
        const data = await fetchClients();
        setClients(data);
    };

    const addLineItem = () => {
        setLineItems([...lineItems, {
            id: `item_${Date.now()}`,
            description: '',
            quantity: 1,
            rate: 0,
            amount: 0
        }]);
    };

    const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
        setLineItems(lineItems.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (field === 'quantity' || field === 'rate') {
                    updated.amount = updated.quantity * updated.rate;
                }
                return updated;
            }
            return item;
        }));
    };

    const removeLineItem = (id: string) => {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter(item => item.id !== id));
        }
    };

    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const generateInvoiceNumber = () => {
        const year = new Date().getFullYear();
        const timestamp = Date.now().toString().slice(-4);
        return `INV-${year}-${timestamp}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedClient) {
            alert('Please select a client');
            return;
        }

        if (lineItems.some(item => !item.description || item.rate === 0)) {
            alert('Please fill in all line items');
            return;
        }

        const now = new Date().toISOString();
        const newInvoice: Invoice = {
            id: `invoice_${Date.now()}`,
            invoiceNumber: generateInvoiceNumber(),
            clientId: selectedClient.id,
            clientName: selectedClient.personalInfo.name,
            clientEmail: selectedClient.personalInfo.email,
            lineItems,
            subtotal,
            taxRate,
            taxAmount,
            total,
            status: InvoiceStatus.DRAFT,
            dueDate: new Date(dueDate).toISOString(),
            issuedDate: now,
            notes,
            createdAt: now,
            updatedAt: now,
            auditTrail: [{
                id: `aud_${Date.now()}`,
                eventType: AuditEventType.CREATED,
                createdAt: now,
                meta: { creator: 'Saul Lowery' },
                ip: '127.0.0.1',
                userAgent: navigator.userAgent
            }]
        };

        await createInvoice(newInvoice);
        navigate(`/invoices/${newInvoice.id}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Invoice</h1>
                <Button variant="secondary" onClick={() => navigate('/invoices')}>Cancel</Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Selection */}
                <Card>
                    <div className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Client Information</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Select Client *
                            </label>
                            <select
                                value={selectedClient?.id || ''}
                                onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value) || null)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            >
                                <option value="">-- Select a client --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.personalInfo.name} ({client.personalInfo.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Due Date *
                            </label>
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </Card>

                {/* Line Items */}
                <Card>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Line Items</h2>
                            <Button type="button" variant="secondary" onClick={addLineItem}>+ Add Item</Button>
                        </div>

                        <div className="space-y-3">
                            {lineItems.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                                    <div className="col-span-5">
                                        <Input
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            placeholder="Qty"
                                            value={item.quantity}
                                            onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            placeholder="Rate"
                                            value={item.rate}
                                            onChange={(e) => updateLineItem(item.id, 'rate', Number(e.target.value))}
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${item.amount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex items-center">
                                        {lineItems.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLineItem(item.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Tax Rate (%):</span>
                                    <Input
                                        type="number"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(Number(e.target.value))}
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        className="w-20"
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                                <span className="text-gray-900 dark:text-white">Total:</span>
                                <span className="text-brand-primary">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Notes */}
                <Card>
                    <div className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Notes</h2>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px]"
                            placeholder="Add any notes or payment instructions..."
                        />
                    </div>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={() => navigate('/invoices')}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Create Invoice
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceCreator;
