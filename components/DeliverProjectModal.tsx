import React, { useState } from 'react';
import { Contract } from '../types';
import { sendDeliveryEmail } from '../services/emailService';
import { updateContract } from '../services/geminiService';
import { uploadDeliveryImage } from '../services/storageService';
import Button from './ui/Button';
import Input from './ui/Input';

interface DeliverProjectModalProps {
    contract: Contract;
    onClose: () => void;
    onSuccess: (updatedContract: Contract) => void;
}

const DeliverProjectModal: React.FC<DeliverProjectModalProps> = ({ contract, onClose, onSuccess }) => {
    const [googleDriveUrl, setGoogleDriveUrl] = useState(contract.delivery?.googleDriveUrl || '');
    const [heroImageUrl, setHeroImageUrl] = useState(contract.delivery?.heroImageUrl || '');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

    const handleSend = async () => {
        if (!googleDriveUrl || (!heroImageUrl && !heroImageFile)) {
            setError("Please provide both a Google Drive URL and a Hero Image.");
            return;
        }

        setIsSending(true);
        setError(null);

        try {
            let finalHeroImageUrl = heroImageUrl;

            if (heroImageFile) {
                // Upload image first
                try {
                    finalHeroImageUrl = await uploadDeliveryImage(heroImageFile);
                } catch (uploadError) {
                    console.error("Upload failed", uploadError);
                    setError("Failed to upload image. Please try again.");
                    setIsSending(false);
                    return;
                }
            }

            const emailSent = await sendDeliveryEmail({
                toEmail: contract.clientEmail,
                toName: contract.clientName,
                contract,
                googleDriveUrl,
                heroImageUrl: finalHeroImageUrl,
                message
            });

            if (emailSent) {
                const updatedContract: Contract = {
                    ...contract,
                    status: 'Completed' as any, // Auto-complete contract if not already
                    delivery: {
                        googleDriveUrl,
                        heroImageUrl: finalHeroImageUrl,
                        deliveredAt: new Date().toISOString(),
                        emailSent: true
                    },
                    auditTrail: [
                        ...(contract.auditTrail || []),
                        {
                            id: `aud_${Date.now()}`,
                            eventType: 'sent' as any, // reusing 'sent' or add 'delivered' type later
                            createdAt: new Date().toISOString(),
                            ip: '0.0.0.0',
                            userAgent: 'System',
                            meta: { type: 'project_delivery', googleDriveUrl }
                        }
                    ]
                };

                await updateContract(updatedContract);
                onSuccess(updatedContract);
                onClose();
            } else {
                setError("Failed to send email. Please check your API key or try again.");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-modal-backdrop overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                            Deliver Project 🚀
                        </h3>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Google Drive Folder Link</label>
                                <Input
                                    value={googleDriveUrl}
                                    onChange={(e) => setGoogleDriveUrl(e.target.value)}
                                    placeholder="https://drive.google.com/drive/folders/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image (for Email)</label>
                                {!heroImageUrl ? (
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-brand-primary transition-colors">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setHeroImageFile(e.target.files[0]);
                                                            // Create local preview
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setHeroImageUrl(reader.result as string);
                                                            };
                                                            reader.readAsDataURL(e.target.files[0]);
                                                        }
                                                    }} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative mt-2 rounded-lg overflow-hidden h-48 w-full bg-gray-100 group">
                                        <img src={heroImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                setHeroImageUrl('');
                                                setHeroImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Personal Message (Optional)</label>
                                <textarea
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2"
                                    rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Hope you enjoy these!"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <Button onClick={handleSend} disabled={isSending} className="w-full sm:w-auto sm:ml-3">
                            {isSending ? 'Sending...' : 'Send Delivery Email'}
                        </Button>
                        <Button variant="secondary" onClick={onClose} disabled={isSending} className="mt-3 w-full sm:mt-0 sm:w-auto">
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliverProjectModal;
