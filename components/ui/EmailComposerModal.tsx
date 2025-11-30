import React, { useState, useEffect, useMemo } from 'react';
import { Client, Contract, EmailTemplate } from '../../types';
import { getTemplates, populateTemplate } from '../../services/emailService';
import Button from './Button';
import Input from './Input';

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  contracts: Contract[];
}

const EmailComposerModal: React.FC<EmailComposerModalProps> = ({ isOpen, onClose, client, contracts }) => {
    const [allTemplates] = useState(() => getTemplates());
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [selectedContractId, setSelectedContractId] = useState<string>(contracts.length > 0 ? contracts[0].id : '');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    
    const activeContract = useMemo(() => {
        return contracts.find(c => c.id === selectedContractId);
    }, [selectedContractId, contracts]);

    useEffect(() => {
        if (selectedTemplateId) {
            const { subject: populatedSubject, body: populatedBody } = populateTemplate(selectedTemplateId, client, activeContract);
            setSubject(populatedSubject);
            setBody(populatedBody);
        } else {
            setSubject('');
            setBody('');
        }
    }, [selectedTemplateId, client, activeContract]);
    
    const handleSendEmail = () => {
        const mailtoLink = `mailto:${client.personalInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
        onClose();
    };
    
    const groupedTemplates = useMemo(() => {
        return allTemplates.reduce((acc, template) => {
            (acc[template.category] = acc[template.category] || []).push(template);
            return acc;
        }, {} as Record<string, EmailTemplate[]>);
    }, [allTemplates]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl my-8">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold dark:text-white">Send Email to {client.personalInfo.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="template-select" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Select Template</label>
                            <select
                                id="template-select"
                                value={selectedTemplateId}
                                onChange={e => setSelectedTemplateId(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm p-3"
                            >
                                <option value="">-- Choose a template --</option>
                                {(Object.entries(groupedTemplates) as [string, EmailTemplate[]][]).map(([category, templates]) => (
                                    <optgroup label={category} key={category}>
                                        {templates.map(template => (
                                            <option key={template.id} value={template.id}>{template.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="contract-select" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Reference Contract (Optional)</label>
                            <select
                                id="contract-select"
                                value={selectedContractId}
                                onChange={e => setSelectedContractId(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm p-3"
                            >
                                <option value="">None</option>
                                {contracts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        </div>
                    </div>
                    <Input
                        id="subject"
                        label="Subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                    />
                    <div>
                        <label htmlFor="body" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Body</label>
                        <textarea
                            id="body"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            rows={15}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm p-3"
                        />
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

export default EmailComposerModal;