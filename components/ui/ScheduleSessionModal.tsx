import React, { useState } from 'react';
import { Client, Contract, Session, SessionStatus } from '../../types';
import Button from './Button';
import Input from './Input';

interface ScheduleSessionModalProps {
  client: Client;
  contracts: Contract[];
  onClose: () => void;
  onSubmit: (formData: Omit<Session, 'id' | 'clientId' | 'clientName' | 'clientEmail' | 'meta' | 'status'>) => Promise<void>;
}

const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({ client, contracts, onClose, onSubmit }) => {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    
    const [formData, setFormData] = useState({
        contractId: contracts.length > 0 ? contracts[0].id : '',
        type: contracts.length > 0 ? contracts[0].title : '',
        dateTime: now.toISOString().slice(0, 16),
        duration: '120',
        location: '',
        notes: '',
        sendInvite: true,
        remind24hr: true,
        remind2hr: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleContractChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const contractId = e.target.value;
        const selectedContract = contracts.find(c => c.id === contractId);
        setFormData(prev => ({
            ...prev,
            contractId,
            type: selectedContract ? selectedContract.title : 'Other',
        }));
    };

    const handleChange = (field: keyof typeof formData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const sessionData = {
            contractId: formData.contractId || undefined,
            sessionDetails: {
                type: formData.type,
                dateTime: new Date(formData.dateTime).toISOString(),
                duration: parseInt(formData.duration, 10),
                location: formData.location,
                notes: formData.notes,
            },
            googleCalendar: {
                inviteSent: formData.sendInvite,
            },
            reminders: {
                email24hr: formData.remind24hr,
                email2hr: formData.remind2hr,
                sent24hr: false,
                sent2hr: false,
            }
        };
        await onSubmit(sessionData);
        setIsSubmitting(false); // The parent component will close the modal
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold dark:text-white">Schedule Session for {client.personalInfo.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="contractId" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Link to Contract (Optional)</label>
                        <select id="contractId" value={formData.contractId} onChange={handleContractChange} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm p-3">
                            <option value="">None</option>
                            {contracts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <Input id="type" label="Session Type" value={formData.type} onChange={e => handleChange('type', e.target.value)} required />
                    <Input id="dateTime" label="Date & Start Time" type="datetime-local" value={formData.dateTime} onChange={e => handleChange('dateTime', e.target.value)} required />
                    <div>
                        <label htmlFor="duration" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                         <select id="duration" value={formData.duration} onChange={e => handleChange('duration', e.target.value)} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm p-3">
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                            <option value="180">3 hours</option>
                            <option value="240">4 hours</option>
                        </select>
                    </div>
                    <Input id="location" label="Location" value={formData.location} onChange={e => handleChange('location', e.target.value)} required />
                    <div>
                        <label htmlFor="notes" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Description / Notes</label>
                        <textarea id="notes" value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm p-3" />
                    </div>
                    <fieldset className="space-y-2 pt-2 border-t dark:border-gray-700">
                         <legend className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">Notifications & Reminders</legend>
                         <div className="flex items-center"><input id="sendInvite" type="checkbox" checked={formData.sendInvite} onChange={e => handleChange('sendInvite', e.target.checked)} className="h-4 w-4 rounded mr-2" /><label htmlFor="sendInvite">Send calendar invite to {client.personalInfo.email}</label></div>
                         <div className="flex items-center"><input id="remind24hr" type="checkbox" checked={formData.remind24hr} onChange={e => handleChange('remind24hr', e.target.checked)} className="h-4 w-4 rounded mr-2" /><label htmlFor="remind24hr">Email reminder 24 hours before</label></div>
                         <div className="flex items-center"><input id="remind2hr" type="checkbox" checked={formData.remind2hr} onChange={e => handleChange('remind2hr', e.target.checked)} className="h-4 w-4 rounded mr-2" /><label htmlFor="remind2hr">Email reminder 2 hours before</label></div>
                    </fieldset>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Scheduling...' : 'Schedule Session'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleSessionModal;
