import React, { useState, useEffect, useMemo } from 'react';
import { Client, Gallery, EmailTemplate } from '../../types';
import { getTemplates, populateTemplate } from '../../services/emailService';
import Button from '../ui/Button';

interface SendGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery: Gallery;
  client: Client;
}

const SendGalleryModal: React.FC<SendGalleryModalProps> = ({ isOpen, onClose, gallery, client }) => {
    const [allTemplates] = useState(() => getTemplates());
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('photos_ready');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        if (selectedTemplateId) {
            const { subject: populatedSubject, body: populatedBody } = populateTemplate(selectedTemplateId, client, null, gallery);
            setSubject(populatedSubject);
            setBody(populatedBody);
        }
    }, [selectedTemplateId, client, gallery]);

    const handleSendEmail = () => {
        const mailtoLink = `mailto:${client.personalInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-modal-backdrop p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl my-8">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold dark:text-white">Send Gallery to {client.personalInfo.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label htmlFor="template-select" className="block text-sm font-medium mb-1">Email Template</label>
                        <select
                            id="template-select"
                            value={selectedTemplateId}
                            onChange={e => setSelectedTemplateId(e.target.value)}
                            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                        >
                            {allTemplates
                                .filter(t => t.category === "Post-Session Messages")
                                .map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold dark:text-white mb-2">Email Preview</h3>
                        <div className="p-3 border rounded-md dark:border-gray-600">
                             <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Subject: {subject}</p>
                             <hr className="my-2 dark:border-gray-600" />
                             <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{body}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end items-center gap-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSendEmail} disabled={!subject || !body}>Open in Email Client</Button>
                </div>
            </div>
        </div>
    );
};

export default SendGalleryModal;