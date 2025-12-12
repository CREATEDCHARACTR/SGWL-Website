import React, { useState } from 'react';
import { Client, ReferralSource } from '../../types';
import Button from './Button';
import Input from './Input';

interface AddClientModalProps {
  onClose: () => void;
  onSubmit: (formData: Omit<Client, 'id' | 'businessInfo' | 'contracts' | 'meta'> & { notes?: string, referralSource?: ReferralSource }) => void;
}

const formatPhoneNumber = (value: string): string => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};


const AddClientModal: React.FC<AddClientModalProps> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        referralSource: ReferralSource.INSTAGRAM,
        notes: ''
    });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: Partial<typeof formData> = {};
        if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters long.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (formData.notes.length > 500) {
            newErrors.notes = 'Notes cannot exceed 500 characters.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        let processedValue = value;
        if (field === 'phone') {
            processedValue = formatPhoneNumber(value);
        }
        setFormData(prev => ({ ...prev, [field]: processedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsSubmitting(true);
        await onSubmit({
            personalInfo: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location
            },
            notes: formData.notes,
            referralSource: formData.referralSource,
        });
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-modal-backdrop p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold dark:text-white">Add New Client</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input id="name" label="Full Name *" value={formData.name} onChange={e => handleChange('name', e.target.value)} required />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <Input id="email" type="email" label="Email Address *" value={formData.email} onChange={e => handleChange('email', e.target.value)} required />
                         {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <Input id="phone" label="Phone Number" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                    <Input id="location" label="Location (City, State)" value={formData.location} onChange={e => handleChange('location', e.target.value)} />
                    <div>
                        <label htmlFor="referralSource" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">How did they find you?</label>
                        <select
                            id="referralSource"
                            value={formData.referralSource}
                            onChange={(e) => handleChange('referralSource', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-base p-3"
                        >
                            {Object.values(ReferralSource).map(source => (
                                <option key={source} value={source}>{source}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
                        <textarea
                            id="notes"
                            value={formData.notes}
                            onChange={e => handleChange('notes', e.target.value)}
                            rows={3}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-base p-3"
                        />
                         {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Client'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientModal;
