import React, { useState } from 'react';
import { DoNotWorkWithInfo, DoNotWorkWithReason } from '../../types';
import Button from './Button';
import Input from './Input';

interface DoNotWorkWithModalProps {
  onClose: () => void;
  onSubmit: (info: DoNotWorkWithInfo) => void;
}

const DoNotWorkWithModal: React.FC<DoNotWorkWithModalProps> = ({ onClose, onSubmit }) => {
    const [reason, setReason] = useState<DoNotWorkWithReason>(DoNotWorkWithReason.PAYMENT_ISSUES);
    const [details, setDetails] = useState('');
    const [amountOwed, setAmountOwed] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (details.length < 50) {
            setError('Details must be at least 50 characters long.');
            return;
        }
        setError('');
        onSubmit({
            reason,
            details,
            amountOwed: amountOwed ? parseFloat(amountOwed) : undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-modal-backdrop p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg my-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400">⚠️ Mark as "Do Not Work With"</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="reason" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Reason *</label>
                        <select
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value as DoNotWorkWithReason)}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm p-3"
                        >
                            {Object.values(DoNotWorkWithReason).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="details" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Details *</label>
                        <textarea
                            id="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={4}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm p-3"
                            placeholder="Describe the situation..."
                        />
                        <p className={`text-sm mt-1 ${details.length < 50 ? 'text-gray-400' : 'text-green-500'}`}>{details.length}/50 characters</p>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <Input id="amountOwed" label="Amount Owed (if applicable)" type="number" placeholder="0.00" value={amountOwed} onChange={e => setAmountOwed(e.target.value)} />
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-bold mb-1">This will:</p>
                        <ul className="list-disc list-inside">
                            <li>Hide the client from active lists.</li>
                            <li>Show a warning when viewing their profile.</li>
                            <li>Prevent creating new contracts for this client.</li>
                        </ul>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 mt-4 border-t dark:border-gray-700">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="button" variant="danger" onClick={handleSubmit}>Mark Client</Button>
                </div>
            </div>
        </div>
    );
};

export default DoNotWorkWithModal;
