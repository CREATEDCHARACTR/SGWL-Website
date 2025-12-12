
import React, { useState } from 'react';
import { Gallery, GalleryStatus, GalleryType } from '../../types';
import { createGallery } from '../../services/geminiService';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface UploadGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    contractId: string;
    clientId: string;
    onUploadComplete: () => void;
}

const UploadGalleryModal: React.FC<UploadGalleryModalProps> = ({ isOpen, onClose, contractId, clientId, onUploadComplete }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<GalleryType>(GalleryType.PROOFING);
    const [deliveryUrl, setDeliveryUrl] = useState('');
    const [instructions, setInstructions] = useState('');
    const [status, setStatus] = useState<GalleryStatus>(GalleryStatus.IN_PROGRESS);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name || !deliveryUrl) return;
        setIsSubmitting(true);

        try {
            const now = new Date().toISOString();
            const galleryData: Omit<Gallery, 'id'> = {
                contractId,
                clientId,
                galleryInfo: {
                    name,
                    description,
                    type,
                    status,
                    createdAt: now,
                    deliveryUrl,
                    instructions,
                },
                photos: [], // No photos hosted internally
                photoCounts: {
                    total: 0,
                    edited: 0,
                },
                shareSettings: {
                    shareLink: deliveryUrl, // The GDrive link is the share link
                    downloadsEnabled: true,
                    passwordProtected: false,
                },
                analytics: {
                    totalViews: 0,
                    uniqueViewers: 0,
                    totalDownloads: 0,
                    accessLog: [],
                },
                meta: {
                    createdBy: 'Saul Lowery',
                    lastModified: now,
                },
            };

            await createGallery(galleryData);
            onUploadComplete();
        } catch (error) {
            console.error("Failed to create delivery:", error);
            alert("Failed to create delivery. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-modal-backdrop p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl my-8">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold dark:text-white">New Delivery</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input id="galleryName" label="Title *" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Wedding Proofs, Final Video" />
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium mb-1">Delivery Type</label>
                            <select id="type" value={type} onChange={e => setType(e.target.value as GalleryType)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                                {Object.values(GalleryType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <Input
                        id="deliveryUrl"
                        label="Google Drive Link *"
                        value={deliveryUrl}
                        onChange={e => setDeliveryUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                    />

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600" placeholder="Internal notes..." />
                    </div>

                    <div>
                        <label htmlFor="instructions" className="block text-sm font-medium mb-1">Client Instructions</label>
                        <textarea
                            id="instructions"
                            value={instructions}
                            onChange={e => setInstructions(e.target.value)}
                            rows={3}
                            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                            placeholder="e.g., Please select your top 50 photos by creating a 'Selections' folder..."
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value as GalleryStatus)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                            {Object.values(GalleryStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end items-center gap-2">
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !name || !deliveryUrl}>{isSubmitting ? 'Creating...' : 'Create Delivery'}</Button>
                </div>
            </div>
        </div>
    );
};

export default UploadGalleryModal;