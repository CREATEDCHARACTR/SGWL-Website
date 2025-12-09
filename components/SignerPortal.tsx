import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from './ui/Button';
import SignatureCanvas from './SignatureCanvas';
import FieldNavigator from './FieldNavigator';
import { getContractById, updateContract, fetchClientById, updateClient, createNotification } from '../services/geminiService';
import { Contract, ContractStatus, PartyRole, SignatureField, SignatureFieldKind, AuditEventType, RevisionRequest, ClientStatus, NotificationType } from '../types';
import ContractPreview from './ContractPreview';
import SignatureSelectionModal from './SignatureSelectionModal';
import DownloadPdfButton from './ui/DownloadPdfButton';


const RevisionRequestModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (message: string) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!message.trim()) return;
        setIsSubmitting(true);
        await onSubmit(message);
        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Request Changes</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Please describe the changes you would like to request. This will send a notification to the sender and pause the signing process.</p>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g., 'Please clarify section 3 regarding deliverables...'"
                    className="w-full h-32 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white"
                    disabled={isSubmitting}
                />
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !message.trim()}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </div>
            </div>
        </div>
    );
};


const ESignConsent: React.FC<{ onConsent: () => void }> = ({ onConsent }) => {
    const [isChecked, setIsChecked] = useState(false);
    return (
        <div className="max-w-3xl mx-auto text-center p-6 sm:p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 dark:text-white">Electronic Record and Signature Disclosure</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                By checking the box below, you consent to electronically receive, review, and sign documents related to this transaction. You agree that your electronic signature is the legal equivalent of your manual signature.
            </p>
            <div className="text-left my-6 p-4 border dark:border-gray-700 rounded-md">
                <label className="flex items-start">
                    <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-brand-primary focus:ring-brand-primary mt-1 bg-gray-100 dark:bg-gray-900" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">I have read and agree to the Electronic Record and Signature Disclosure.</span>
                </label>
            </div>
            <Button onClick={onConsent} disabled={!isChecked}>Continue</Button>
        </div>
    )
};

const SignerPortal: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [contract, setContract] = useState<Contract | null | undefined>(undefined);
    const [step, setStep] = useState<'consent' | 'signing' | 'complete'>('consent');
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

    const [fieldResponses, setFieldResponses] = useState<Record<string, string>>({});
    const [activeField, setActiveField] = useState<SignatureField | null>(null);

    // State for saved signature flow
    const [showSignatureSelection, setShowSignatureSelection] = useState(false);
    const [savedSignatureUrl, setSavedSignatureUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadContract = async () => {
            if (!token) {
                setContract(null);
                return;
            }
            try {
                const foundContract = await getContractById(token);
                setContract(foundContract);
                if (foundContract) {
                    if (foundContract.status === ContractStatus.COMPLETED) {
                        setStep('complete');
                    }
                    // Initialize with existing signatures (e.g., from the provider)
                    setFieldResponses(foundContract.fieldValues || {});
                }
            } catch (error) {
                console.error("Error loading contract for signing:", error);
                setContract(null);
            }
        }
        loadContract();
    }, [token]);

    const handleApplySignature = (dataUrl: string) => {
        if (activeField && contract) {
            const today = new Date().toLocaleDateString();
            const dateFieldsForSigner = contract.signatureFields.filter(
                f => f.partyId === activeField.partyId && f.kind === SignatureFieldKind.DATE
            );

            const newResponses = { ...fieldResponses, [activeField.id]: dataUrl };

            dateFieldsForSigner.forEach(dateField => {
                newResponses[dateField.id] = today;
            });

            setFieldResponses(newResponses);
        }
        setIsCanvasOpen(false);
        setActiveField(null);
    };

    const handleSignatureFieldClick = (field: SignatureField) => {
        setActiveField(field);
        const savedSig = localStorage.getItem('slp-saved-signature');
        if (savedSig) {
            setSavedSignatureUrl(savedSig);
            setShowSignatureSelection(true);
        } else {
            setIsCanvasOpen(true);
        }
    };

    const handleUseSavedSignature = () => {
        if (savedSignatureUrl) {
            handleApplySignature(savedSignatureUrl);
        }
        setShowSignatureSelection(false);
        setSavedSignatureUrl(null);
    };

    const handleDrawNewSignature = () => {
        setShowSignatureSelection(false);
        setSavedSignatureUrl(null);
        setIsCanvasOpen(true);
    };


    const handleDateClick = (field: SignatureField) => {
        const today = new Date().toLocaleDateString();
        setFieldResponses(prev => ({ ...prev, [field.id]: today }));
    };

    const handleCheckboxChange = (field: SignatureField, isChecked: boolean) => {
        setFieldResponses(prev => {
            const newResponses = { ...prev };
            if (isChecked) {
                newResponses[field.id] = 'checked';
            } else {
                delete newResponses[field.id];
            }
            return newResponses;
        });
    };

    const handleTextChange = (field: SignatureField, value: string) => {
        setFieldResponses(prev => ({ ...prev, [field.id]: value }));
    };

    const handleFinishSigning = async () => {
        if (!contract) return;
        const now = new Date().toISOString();
        const updatedContract = {
            ...contract,
            status: ContractStatus.COMPLETED,
            fieldValues: fieldResponses, // Save the merged signature data
            updatedAt: now,
            auditTrail: [
                ...(contract.auditTrail || []),
                {
                    id: `aud_${Date.now()}`,
                    eventType: AuditEventType.SIGNED,
                    createdAt: now,
                    ip: '203.0.113.55',
                    userAgent: navigator.userAgent,
                    meta: { party: clientParty?.name },
                }
            ],
        };
        await updateContract(updatedContract);
        setContract(updatedContract); // Update local state to re-render for PDF generation

        // Update client status to HOT
        if (contract.clientId) {
            const client = await fetchClientById(contract.clientId);
            if (client) {
                client.status = ClientStatus.HOT;
                client.businessInfo.lastContact = now;
                await updateClient(client);
            }
        }

        setStep('complete');
    }

    const handleRevisionRequest = async (message: string) => {
        if (!contract || !clientParty) return;
        const now = new Date().toISOString();

        const newRequest: RevisionRequest = {
            partyId: clientParty.id,
            message,
            createdAt: now,
        };

        const newAuditEvent = {
            id: `aud_${Date.now()}`,
            eventType: AuditEventType.REVISION_REQUESTED,
            createdAt: now,
            ip: '203.0.113.55', // mock
            userAgent: 'Browser/1.0', // mock
            meta: { party: clientParty.name },
        };

        const updatedContract: Contract = {
            ...contract,
            status: ContractStatus.REVISION_REQUESTED,
            updatedAt: now,
            revisionRequests: [...(contract.revisionRequests || []), newRequest],
            auditTrail: [...(contract.auditTrail || []), newAuditEvent],
        };

        await updateContract(updatedContract);

        // Create notification for the admin
        await createNotification({
            type: NotificationType.REVISION_REQUESTED,
            isRead: false,
            createdAt: now,
            title: 'Contract Revision Requested',
            message: `${clientParty.name} has requested changes to "${contract.title}".`,
            clientId: contract.clientId,
            contractId: contract.id,
        });

        setContract(updatedContract);
        setIsRevisionModalOpen(false);
    };

    if (contract === undefined) {
        return <div className="text-center p-8">Loading contract...</div>;
    }

    if (!contract) {
        return <div className="text-center p-8">Loading contract or invalid link...</div>;
    }

    // Identify the current signer (client) and their required fields
    const clientParty = contract.parties.find(p => p.role !== PartyRole.PROVIDER);
    const clientRequiredFields = clientParty ? contract.signatureFields.filter(f => f.partyId === clientParty.id) : [];
    const completedFieldsCount = clientRequiredFields.filter(f => !!fieldResponses[f.id]).length;


    if (step === 'consent') {
        return (
            <div className="min-h-screen flex items-start justify-center p-4 overflow-y-auto">
                <div className="w-full my-8">
                    <ESignConsent onConsent={() => setStep('signing')} />
                </div>
            </div>
        );
    }

    const completionView = (
        <div className="max-w-2xl mx-auto my-8 text-center p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Contract Completed!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Thank you. The contract has been completed by all parties. A copy has been sent to all participants for their records.</p>
            <DownloadPdfButton contract={contract} />
        </div>
    );

    if (step === 'complete') {
        return completionView;
    }

    if (contract.status === ContractStatus.REVISION_REQUESTED) {
        return (
            <div className="max-w-2xl mx-auto my-8 text-center p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-yellow-600 mb-4">Changes Requested</h1>
                <p className="text-gray-600 dark:text-gray-300">You have requested changes to this contract. The sender has been notified and will send a revised version for you to review. This signing link will be active again once a new version is ready.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-secondary dark:bg-gray-900 overflow-x-hidden pb-28">
            <div className="max-w-4xl mx-auto my-4 sm:my-8 px-2 sm:px-0">
                <div className="text-center mb-4">
                    <Button variant="secondary" onClick={() => setIsRevisionModalOpen(true)}>Request Changes</Button>
                </div>
                <div className="contract-viewport">
                    <div
                        id="contract-printable-area"
                        className="contract-document bg-white dark:bg-gray-800 shadow-2xl rounded-lg ring-1 ring-black/5 dark:ring-white/10"
                        aria-label="Contract document"
                    >
                        <div className="relative p-4 sm:p-14 md:p-18">
                            <ContractPreview contract={contract} />

                            {contract.signatureFields.map(field => {
                                const response = fieldResponses[field.id];
                                const isClientField = clientParty && field.partyId === clientParty.id;
                                const baseStyle = {
                                    left: `${field.x}%`,
                                    top: `${field.y}%`,
                                    width: `${field.width}%`,
                                    height: `${field.height}%`,
                                };

                                if (isClientField) {
                                    // Render interactive field for the client
                                    const baseClasses = "absolute border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-brand-primary bg-yellow-100/50";
                                    switch (field.kind) {
                                        case SignatureFieldKind.SIGNATURE:
                                        case SignatureFieldKind.INITIAL:
                                            return (
                                                <div key={field.id} onClick={() => handleSignatureFieldClick(field)} className={baseClasses} style={baseStyle}>
                                                    {response ? <img src={response} alt="Signature" className="h-full w-full object-contain" /> : <span className="text-sm font-semibold text-yellow-800 capitalize">Click to {field.kind}</span>}
                                                </div>
                                            );
                                        case SignatureFieldKind.DATE:
                                            return (
                                                <div key={field.id} onClick={() => handleDateClick(field)} className={baseClasses} style={baseStyle}>
                                                    {response ? <span className="font-semibold text-gray-800 text-sm">{response}</span> : <span className="text-sm font-semibold text-yellow-800">Click for Date</span>}
                                                </div>
                                            );
                                        case SignatureFieldKind.CHECKBOX:
                                            return (
                                                <div key={field.id} className="absolute flex items-center justify-center" style={baseStyle}>
                                                    <label className="flex items-center space-x-2 cursor-pointer p-1 bg-yellow-100/80 rounded">
                                                        <input type="checkbox" checked={!!response} onChange={(e) => handleCheckboxChange(field, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                                                        <span className="text-xs text-yellow-900 font-medium">I agree</span>
                                                    </label>
                                                </div>
                                            );
                                        case SignatureFieldKind.TEXT:
                                            return (
                                                <div key={field.id} className="absolute" style={{ ...baseStyle, height: 'auto', minHeight: `${field.height}%` }}>
                                                    <input type="text" value={response || ''} onChange={(e) => handleTextChange(field, e.target.value)} placeholder="Type here..." className="w-full h-full text-sm p-1 border-2 border-dashed border-yellow-500 bg-yellow-100/50 focus:outline-none focus:border-brand-primary" />
                                                </div>
                                            );
                                        default: return null;
                                    }
                                } else if (response) {
                                    // Render read-only pre-filled field (provider's signature)
                                    const style = { position: 'absolute' as const, ...baseStyle };
                                    switch (field.kind) {
                                        case SignatureFieldKind.SIGNATURE:
                                        case SignatureFieldKind.INITIAL:
                                            return <img key={field.id} src={response} alt="Signature" style={{ ...style, objectFit: 'contain' }} />;
                                        case SignatureFieldKind.DATE:
                                            return <span key={field.id} style={style} className="flex items-center justify-center font-semibold text-gray-800 text-sm">{response}</span>
                                        default: return null;
                                    }
                                }
                                return null;
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <FieldNavigator
                totalFields={clientRequiredFields.length}
                completedFields={completedFieldsCount}
                onNext={handleFinishSigning}
            />

            {isCanvasOpen && <SignatureCanvas onApply={handleApplySignature} onClose={() => setIsCanvasOpen(false)} />}

            {showSignatureSelection && savedSignatureUrl && (
                <SignatureSelectionModal
                    savedSignatureUrl={savedSignatureUrl}
                    onUseSaved={handleUseSavedSignature}
                    onDrawNew={handleDrawNewSignature}
                    onClose={() => setShowSignatureSelection(false)}
                />
            )}
            <RevisionRequestModal
                isOpen={isRevisionModalOpen}
                onClose={() => setIsRevisionModalOpen(false)}
                onSubmit={handleRevisionRequest}
            />
        </div>
    );
};

export default SignerPortal;