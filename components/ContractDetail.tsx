import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getContractById, updateContract, createContract, archiveContract, unarchiveContract } from '../services/geminiService';
import { AuditEvent, AuditEventType, Contract, ContractParty, ContractStatus, PartyRole, SignatureField, SignatureFieldKind, ProjectTask, ContractVersion } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import PlacedField from './PlacedField';
import ContractPreview from './ContractPreview';
import Input from './ui/Input';
import FieldNavigator from './FieldNavigator';
import SignatureCanvas from './SignatureCanvas';
import SignatureSelectionModal from './SignatureSelectionModal';
import DownloadPdfButton from './ui/DownloadPdfButton';
import SendEmailButton from './ui/SendEmailButton';
import VersionHistory from './VersionHistory';
import VersionComparisonModal from './VersionComparisonModal';

import ConfirmationModal from './ui/ConfirmationModal';
import DeliverProjectModal from './DeliverProjectModal';
import ContractGalleriesTab from './galleries/ContractGalleriesTab';
import SEO from './SEO';


const getDeadlineColor = (deadline?: string) => {
    if (!deadline) return 'text-gray-500 dark:text-gray-400';
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates only
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-600 dark:text-red-500 font-semibold';
    if (diffDays <= 7) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-gray-500 dark:text-gray-400';
};

const ProjectManagement: React.FC<{ contract: Contract, onUpdate: (updatedContract: Contract) => void }> = ({ contract, onUpdate }) => {
    const [tasks, setTasks] = useState({
        nextSteps: contract.nextSteps || [],
        requirements: contract.requirements || [],
        followUps: contract.followUps || [],
    });
    const [editingTask, setEditingTask] = useState<{ list: keyof typeof tasks, task: ProjectTask } | null>(null);

    const handleUpdate = async (updatedTasks: typeof tasks) => {
        setTasks(updatedTasks);
        const updatedContract = {
            ...contract,
            nextSteps: updatedTasks.nextSteps,
            requirements: updatedTasks.requirements,
            followUps: updatedTasks.followUps,
        };
        await updateContract(updatedContract);
        onUpdate(updatedContract);
    };

    const addTask = (list: keyof typeof tasks) => {
        const newTask: ProjectTask = { id: `task_${Date.now()}`, text: '', status: 'pending' };
        handleUpdate({ ...tasks, [list]: [...tasks[list], newTask] });
        setEditingTask({ list, task: newTask });
    };

    const updateTask = (list: keyof typeof tasks, updatedTask: ProjectTask) => {
        const updatedList = tasks[list].map(t => t.id === updatedTask.id ? updatedTask : t);
        handleUpdate({ ...tasks, [list]: updatedList });
    };

    const deleteTask = (list: keyof typeof tasks, taskId: string) => {
        const updatedList = tasks[list].filter(t => t.id !== taskId);
        handleUpdate({ ...tasks, [list]: updatedList });
    };

    const renderTaskList = (list: keyof typeof tasks, title: string) => (
        <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{title}</h4>
            <div className="space-y-2">
                {tasks[list].map(task => (
                    <div key={task.id} className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-700/50 group">
                        <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={(e) => updateTask(list, { ...task, status: e.target.checked ? 'completed' : 'pending' })}
                            className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <div className="flex-grow">
                            {editingTask?.task.id === task.id ? (
                                <input
                                    type="text"
                                    value={editingTask.task.text}
                                    onChange={(e) => setEditingTask({ ...editingTask, task: { ...editingTask.task, text: e.target.value } })}
                                    onBlur={() => { updateTask(list, editingTask.task); setEditingTask(null); }}
                                    className="w-full bg-transparent p-1 border-b focus:outline-none focus:border-brand-primary dark:text-white"
                                    autoFocus
                                />
                            ) : (
                                <p onClick={() => setEditingTask({ list, task })} className={`cursor-pointer ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {task.text || <span className="text-gray-400">Click to edit...</span>}
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className={getDeadlineColor(task.deadline)}>
                                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                                </span>
                                {editingTask?.task.id !== task.id && (
                                    <input
                                        type="date"
                                        value={task.deadline ? task.deadline.split('T')[0] : ''}
                                        onChange={(e) => updateTask(list, { ...task, deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                                        className="bg-transparent opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                    />
                                )}
                            </div>
                        </div>
                        <button onClick={() => deleteTask(list, task.id)} className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
                <Button variant="secondary" onClick={() => addTask(list)} className="w-full mt-2 text-sm !py-1.5">+ Add Item</Button>
            </div>
        </div>
    );

    return (
        <Card>
            <div className="p-6 space-y-6">
                {renderTaskList('nextSteps', 'Next Steps')}
                {renderTaskList('requirements', 'Client Requirements')}
                {renderTaskList('followUps', 'Follow-ups')}
            </div>
        </Card>
    );
};


const AuditTrail: React.FC<{ events: AuditEvent[] }> = ({ events }) => {
    const getEventIcon = (type: AuditEventType) => {
        const iconMap: Record<AuditEventType, string> = {
            [AuditEventType.CREATED]: '📝',
            [AuditEventType.SENT]: '✉️',
            [AuditEventType.VIEWED]: '👁️',
            [AuditEventType.OTP_SENT]: '🔒',
            [AuditEventType.OTP_VERIFIED]: '✅',
            [AuditEventType.SIGNED]: '✒️',
            [AuditEventType.DECLINED]: '❌',
            [AuditEventType.DOWNLOADED]: '📄',
            [AuditEventType.HASH_VERIFIED]: '🔗',
            [AuditEventType.REVISED]: '🔄',
            [AuditEventType.REVISION_REQUESTED]: '💬',
            [AuditEventType.ARCHIVED]: '📦',
            [AuditEventType.UNARCHIVED]: '📤',
        };
        return iconMap[type] || '⚙️';
    };

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {(events || []).map((event, eventIdx) => (
                    <li key={event.id}>
                        <div className="relative pb-8">
                            {eventIdx !== events.length - 1 ? (
                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                                        {getEventIcon(event.eventType)}
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">{event.eventType.replace(/_/g, ' ')}</span>
                                            {event.ip && ` from ${event.ip}`}
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                        <time dateTime={event.createdAt}>{new Date(event.createdAt).toLocaleString()}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const getStatusClasses = (status: ContractStatus): string => {
    const statusClassMap: Partial<Record<ContractStatus, string>> = {
        [ContractStatus.DRAFT]: 'bg-status-draft/20 text-status-draft',
        [ContractStatus.SENT]: 'bg-status-sent/20 text-status-sent',
        [ContractStatus.VIEWED]: 'bg-status-viewed/20 text-status-viewed',
        [ContractStatus.REVISION_REQUESTED]: 'bg-purple-500/20 text-purple-500',
        [ContractStatus.COMPLETED]: 'bg-status-signed/20 text-status-signed',
        [ContractStatus.DECLINED]: 'bg-status-declined/20 text-status-declined',
        [ContractStatus.PARTIALLY_SIGNED]: 'bg-blue-400/20 text-blue-500',
        [ContractStatus.EXPIRED]: 'bg-gray-400/20 text-gray-500',
    };
    return statusClassMap[status] ?? 'bg-gray-200 text-gray-800';
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-md focus:outline-none ${active
            ? 'border-b-2 border-brand-primary text-brand-primary'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
    >
        {children}
    </button>
);


const ContractDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [contract, setContract] = useState<Contract | null | undefined>(undefined);

    const [isPreparing, setIsPreparing] = useState(false);
    const [fields, setFields] = useState<SignatureField[]>([]);

    const [showSendModal, setShowSendModal] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'project' | 'audit' | 'galleries'>('overview');

    const [isProviderSigning, setIsProviderSigning] = useState(false);
    const [providerFieldResponses, setProviderFieldResponses] = useState<Record<string, string>>({});
    const [activeProviderField, setActiveProviderField] = useState<SignatureField | null>(null);
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);

    const [showSignatureSelection, setShowSignatureSelection] = useState(false);
    const [savedSignatureUrl, setSavedSignatureUrl] = useState<string | null>(null);

    const [comparisonModalState, setComparisonModalState] = useState<{ isOpen: boolean, versions: [number, number] | null }>({ isOpen: false, versions: null });
    const [restoreModalState, setRestoreModalState] = useState<{ isOpen: boolean, versionToRestore: number | null }>({ isOpen: false, versionToRestore: null });

    const [archiveModalState, setArchiveModalState] = useState<{ isOpen: boolean, action: 'archive' | 'unarchive' | null }>({ isOpen: false, action: null });
    const [showDeliverModal, setShowDeliverModal] = useState(false);
    const [showUnsignedWarning, setShowUnsignedWarning] = useState(false);

    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadContract = async () => {
            if (!id) return;
            try {
                const fetchedContract = await getContractById(id);
                setContract(fetchedContract);
            } catch (error) {
                console.error("Failed to load contract:", error);
                setContract(null);
            }
        };
        loadContract();
    }, [id]);

    const partyNames = useMemo(() => {
        return contract?.parties.reduce((acc, party) => {
            acc[party.id] = party.name;
            return acc;
        }, {} as Record<string, string>) ?? {};
    }, [contract]);

    const provider = useMemo(() => contract?.parties.find(p => p.role === PartyRole.PROVIDER), [contract?.parties]);

    const providerHasFieldsToSign = useMemo(() => {
        return fields.some(f => f.partyId === provider?.id);
    }, [fields, provider]);


    useEffect(() => {
        if (isPreparing && previewRef.current) {
            setTimeout(() => {
                const container = previewRef.current;
                if (!container) return;

                const pElement = container.querySelector('p');
                const baseLineHeight = pElement ? parseFloat(window.getComputedStyle(pElement).lineHeight) : 24;

                const placeholders = container.querySelectorAll<HTMLElement>('.signature-placeholder');
                const newFields: SignatureField[] = [];

                placeholders.forEach(el => {
                    const partyId = el.dataset.partyId;
                    const fieldKind = el.dataset.fieldKind as SignatureFieldKind;

                    if (!partyId || !fieldKind) return;

                    const fieldHeightPx = fieldKind === SignatureFieldKind.SIGNATURE
                        ? baseLineHeight * 2.2
                        : baseLineHeight * 1.1;

                    const fieldWidthPx = fieldKind === SignatureFieldKind.SIGNATURE
                        ? baseLineHeight * 12
                        : baseLineHeight * 7;

                    const containerRect = container.getBoundingClientRect();
                    const elRect = el.getBoundingClientRect();

                    const elLeftInContainer = elRect.left - containerRect.left + container.scrollLeft;
                    const elTopInContainer = elRect.top - containerRect.top + container.scrollTop;

                    const lineCenterY = elTopInContainer + (baseLineHeight / 2);
                    const yPx = lineCenterY - (fieldHeightPx / 2);
                    const xPx = elLeftInContainer;

                    const yPercent = (yPx / container.scrollHeight) * 100;
                    const xPercent = (xPx / container.scrollWidth) * 100;
                    const heightPercent = (fieldHeightPx / container.scrollHeight) * 100;
                    const widthPercent = (fieldWidthPx / container.scrollWidth) * 100;

                    newFields.push({
                        id: `field_${partyId}_${fieldKind}_${Math.random()}`,
                        partyId,
                        kind: fieldKind,
                        page: 1,
                        x: Math.max(0, xPercent),
                        y: Math.max(0, yPercent),
                        width: widthPercent,
                        height: heightPercent,
                    });
                });

                setFields(newFields);
            }, 100);
        }
    }, [isPreparing, contract]);

    const signingLink = `${window.location.origin}${window.location.pathname}#/sign/${contract?.id}`;

    const handlePrepareClick = () => {
        setFields([]);
        setIsPreparing(true);
    };

    const handleCancel = () => {
        setIsPreparing(false);
        setFields([]);
    };

    const handleSaveAndStartSigning = async () => {
        if (!contract) return;
        const updatedContract = { ...contract, signatureFields: fields };
        await updateContract(updatedContract);
        setContract(updatedContract);

        setIsPreparing(false);
        setIsProviderSigning(true);
    };


    const handleProviderSignAndSend = async () => {
        if (!contract) return;
        const now = new Date().toISOString();
        const currentTrail = contract.auditTrail || [];

        const signedEvent: AuditEvent = {
            id: `aud_${Date.now()}`,
            eventType: AuditEventType.SIGNED,
            createdAt: now,
            meta: { signer: contract.parties.find(p => p.role === PartyRole.PROVIDER)?.name },
            ip: '78.22.1.19',
            userAgent: 'Chrome/125.0.0.0',
        };
        const sentEvent: AuditEvent = {
            id: `aud_${Date.now() + 1}`,
            eventType: AuditEventType.SENT,
            createdAt: now,
            meta: { to: contract.clientEmail },
            ip: '78.22.1.19',
            userAgent: 'Chrome/125.0.0.0',
        };

        const updatedContract = {
            ...contract,
            status: ContractStatus.SENT,
            fieldValues: providerFieldResponses,
            updatedAt: now,
            auditTrail: [...currentTrail, signedEvent, sentEvent],
        };

        await updateContract(updatedContract);
        setContract(updatedContract);
        setIsProviderSigning(false);
        setShowSendModal(true);
    };

    const handleUpdateField = (updatedField: SignatureField) => {
        setFields(prev => prev.map(f => f.id === updatedField.id ? updatedField : f));
    };

    const handleDeleteField = (fieldId: string) => {
        setFields(prev => prev.filter(f => f.id !== fieldId));
    };

    // Check if the provider (admin) has signed - looks for signature fields in fieldValues
    const hasProviderSigned = useMemo(() => {
        if (!contract || !provider) return false;
        const providerSignatureFields = contract.signatureFields?.filter(
            f => f.partyId === provider.id && f.kind === SignatureFieldKind.SIGNATURE
        ) || [];
        // Check if any provider signature field has a value in fieldValues
        return providerSignatureFields.some(f => !!contract.fieldValues?.[f.id]);
    }, [contract, provider]);

    // Play warning sound
    const playWarningSound = () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            // Warning beep - low tone
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 - low warning tone
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            // Second beep
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.setValueAtTime(220, audioContext.currentTime);
                osc2.type = 'square';
                gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                osc2.start(audioContext.currentTime);
                osc2.stop(audioContext.currentTime + 0.3);
            }, 200);
        } catch (e) {
            console.log('Warning sound not supported');
        }
    };

    const copyLinkToClipboard = () => {
        // Check if provider has signed first
        if (!hasProviderSigned) {
            playWarningSound();
            setShowUnsignedWarning(true);
            return;
        }
        navigator.clipboard.writeText(signingLink).then(() => {
            setIsLinkCopied(true);
            setTimeout(() => setIsLinkCopied(false), 2000);
        });
    };

    const handleCompare = (v1: number, v2: number) => {
        setComparisonModalState({ isOpen: true, versions: [v1, v2] });
    };

    const handleRestore = async () => {
        if (!contract || restoreModalState.versionToRestore === null) return;

        const versionToRestore = contract.history?.find(v => v.version === restoreModalState.versionToRestore);
        if (!versionToRestore) return;

        const currentVersionSnapshot: ContractVersion = {
            version: contract.version,
            createdAt: contract.updatedAt,
            modifiedBy: "Saul Lowery",
            changes: [],
            variables: contract.variables,
        };

        const restoredContract: Contract = {
            ...contract,
            version: contract.version + 1,
            updatedAt: new Date().toISOString(),
            status: ContractStatus.DRAFT,
            variables: versionToRestore.variables,
            history: [...(contract.history || []), currentVersionSnapshot],
            fieldValues: {},
            signatureFields: [],
        };

        await updateContract(restoredContract);
        setContract(restoredContract);
        setRestoreModalState({ isOpen: false, versionToRestore: null });
        setActiveTab('overview');
    };

    const handleDuplicate = async () => {
        if (!contract) return;

        const newContractId = `contract_${Date.now()}`;
        // Create new party IDs to ensure uniqueness
        const partyIdMap: Record<string, string> = {};
        const newParties = contract.parties.map(p => {
            const newId = `party_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            partyIdMap[p.id] = newId;
            return { ...p, id: newId };
        });

        // Map signature fields to new party IDs
        const newSignatureFields = contract.signatureFields.map(f => ({
            ...f,
            id: `field_${partyIdMap[f.partyId]}_${f.kind}_${Math.random()}`,
            partyId: partyIdMap[f.partyId]
        }));

        const newContract: Contract = {
            ...contract,
            id: newContractId,
            title: `${contract.title} (Copy)`,
            status: ContractStatus.DRAFT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            parties: newParties,
            signatureFields: newSignatureFields,
            fieldValues: {}, // Reset signatures
            auditTrail: [{
                id: `aud_${Date.now()}`,
                eventType: AuditEventType.CREATED,
                createdAt: new Date().toISOString(),
                meta: { method: 'duplicate', sourceId: contract.id }
            }],
            versions: [],
            history: [], // Reset history
            revisionRequests: [],
            nextSteps: [],
            requirements: [],
            followUps: []
        };

        await createContract(newContract);
        navigate(`/contracts/${newContractId}`);
    };

    const handleArchive = async () => {
        if (!contract) return;
        await archiveContract(contract.id);
        const updatedContract = { ...contract, status: ContractStatus.ARCHIVED };
        setContract(updatedContract);
        setArchiveModalState({ isOpen: false, action: null });
    };

    const handleUnarchive = async () => {
        if (!contract) return;
        await unarchiveContract(contract.id, ContractStatus.DRAFT);
        const updatedContract = { ...contract, status: ContractStatus.DRAFT };
        setContract(updatedContract);
        setArchiveModalState({ isOpen: false, action: null });
    };

    const providerFields = provider ? contract?.signatureFields.filter(f => f.partyId === provider.id) : [];
    const completedProviderFieldsCount = providerFields.filter(f => !!providerFieldResponses[f.id]).length;

    const handleApplyProviderSignature = (dataUrl: string) => {
        if (activeProviderField && contract) {
            const today = new Date().toLocaleDateString();
            const dateFieldsForSigner = contract.signatureFields.filter(
                f => f.partyId === activeProviderField.partyId && f.kind === SignatureFieldKind.DATE
            );
            const newResponses = { ...providerFieldResponses, [activeProviderField.id]: dataUrl };
            dateFieldsForSigner.forEach(dateField => {
                newResponses[dateField.id] = today;
            });
            setProviderFieldResponses(newResponses);
        }
        setIsCanvasOpen(false);
        setActiveProviderField(null);
    };

    const handleProviderSignatureClick = (field: SignatureField) => {
        setActiveProviderField(field);
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
            handleApplyProviderSignature(savedSignatureUrl);
        }
        setShowSignatureSelection(false);
        setSavedSignatureUrl(null);
    };

    const handleDrawNewSignature = () => {
        setShowSignatureSelection(false);
        setSavedSignatureUrl(null);
        setIsCanvasOpen(true);
    };

    const renderProviderSigningFields = () => providerFields.map(field => {
        const response = providerFieldResponses[field.id];
        const baseStyle = { left: `${field.x}%`, top: `${field.y}%`, width: `${field.width}%`, height: `${field.height}%` };
        const baseClasses = "absolute border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-brand-primary bg-yellow-100/50";
        switch (field.kind) {
            case SignatureFieldKind.SIGNATURE:
            case SignatureFieldKind.INITIAL:
                return (
                    <div key={field.id} onClick={() => handleProviderSignatureClick(field)} className={baseClasses} style={baseStyle}>
                        {response ? <img src={response} alt="Signature" className="h-full w-full object-contain" /> : <span className="text-sm font-semibold text-yellow-800 capitalize">Click to {field.kind}</span>}
                    </div>
                );
            case SignatureFieldKind.DATE:
                return (
                    <div key={field.id} onClick={() => setProviderFieldResponses(prev => ({ ...prev, [field.id]: new Date().toLocaleDateString() }))} className={baseClasses} style={baseStyle}>
                        {response ? <span className="font-semibold text-gray-800 text-sm">{response}</span> : <span className="text-sm font-semibold text-yellow-800">Click for Date</span>}
                    </div>
                );
            default: return null;
        }
    });


    const renderRightPanel = () => {
        if (!contract) return null;
        if (isPreparing) {
            return (
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Review Placed Fields</h3>
                        {fields.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Auto-placing fields...</p>
                        ) : (
                            <ul className="space-y-2 max-h-96 overflow-y-auto">
                                {fields.map(field => (
                                    <li key={field.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                        <div>
                                            <p className="font-medium capitalize text-sm">{field.kind}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">For: {partyNames[field.partyId] || 'Unassigned'}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteField(field.id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                            aria-label={`Delete ${field.kind} field`}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Card>
            );
        }

        const lastRevisionRequest = contract.revisionRequests && contract.revisionRequests[contract.revisionRequests.length - 1];

        return (
            <div>
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
                        <TabButton active={activeTab === 'versions'} onClick={() => setActiveTab('versions')}>Versions</TabButton>
                        <TabButton active={activeTab === 'galleries'} onClick={() => setActiveTab('galleries')}>Galleries</TabButton>
                        <TabButton active={activeTab === 'project'} onClick={() => setActiveTab('project')}>Project</TabButton>
                        <TabButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')}>Audit</TabButton>
                    </nav>
                </div>
                <div className="mt-4">
                    {activeTab === 'overview' && (
                        <Card>
                            <div className="p-6 space-y-6">
                                {contract.status === ContractStatus.REVISION_REQUESTED && lastRevisionRequest && (
                                    <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700">
                                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Client Revision Request</h3>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">Received on {new Date(lastRevisionRequest.createdAt).toLocaleString()}</p>
                                        <blockquote className="mt-2 pl-4 border-l-4 border-yellow-500 text-gray-700 dark:text-gray-300 italic">
                                            "{lastRevisionRequest.message}"
                                        </blockquote>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 dark:text-white">Contract Status</h3>
                                    <p className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(contract.status)}`}>{contract.status}</p>
                                </div>

                                {[ContractStatus.SENT, ContractStatus.VIEWED, ContractStatus.PARTIALLY_SIGNED].includes(contract.status) && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 border-t dark:border-gray-700 pt-4 dark:text-white">Client Access</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label htmlFor="persistent-signing-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Secure Signing Link
                                                </label>
                                                <div className="flex items-center space-x-2">
                                                    <Input
                                                        id="persistent-signing-link"
                                                        type="text"
                                                        readOnly
                                                        value={signingLink}
                                                        className="bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                                                    />
                                                    <Button onClick={copyLinkToClipboard} variant="secondary" className="flex-shrink-0">
                                                        {isLinkCopied ? 'Copied!' : 'Copy'}
                                                    </Button>
                                                </div>
                                            </div>
                                            <SendEmailButton
                                                contract={contract}
                                                isAdminSigned={hasProviderSigned}
                                                onUnsignedAttempt={() => {
                                                    playWarningSound();
                                                    setShowUnsignedWarning(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 sm:static sm:bg-transparent sm:p-0 sm:border-0 z-50 sm:z-auto shadow-lg sm:shadow-none justify-between sm:justify-end">
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate('/dashboard')}
                                        className="flex-1 sm:flex-none justify-center"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => setIsProviderSigning(true)}
                                        className="flex-1 sm:flex-none justify-center shadow-lg shadow-brand-primary/20"
                                    >
                                        Sign Contract
                                    </Button>
                                </div>

                                {/* Desktop only buttons */}
                                <div className="hidden sm:flex gap-3">
                                    <SendEmailButton contract={contract} />
                                    <DownloadPdfButton contract={contract} />
                                </div>
                            </div>
                        </Card>
                    )}
                    {activeTab === 'versions' && (
                        <Card><div className="p-6"><VersionHistory contract={contract} onCompare={handleCompare} onRestore={(v) => setRestoreModalState({ isOpen: true, versionToRestore: v })} onView={(v) => handleCompare(v, v)} /></div></Card>
                    )}
                    {activeTab === 'galleries' && <ContractGalleriesTab contract={contract} />}
                    {activeTab === 'project' && <ProjectManagement contract={contract} onUpdate={setContract} />}
                    {activeTab === 'audit' && (
                        <Card>
                            <div className="p-6">
                                <AuditTrail events={contract.auditTrail || []} />
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        );
    };

    if (contract === undefined) {
        return <div className="text-center p-8">Loading contract...</div>;
    }

    if (contract === null) {
        return <div className="text-center p-8">Contract not found.</div>;
    }

    const isEditable = [ContractStatus.DRAFT, ContractStatus.SENT, ContractStatus.VIEWED, ContractStatus.REVISION_REQUESTED].includes(contract.status);

    return (
        <>
            <SEO title={`Contract: ${contract.title} - SaulGOOD WEATHER Lowery`} />
            <div className="space-y-6">
                {/* Mobile action bar - shows essential buttons on mobile */}
                <div className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 -mx-4 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">{contract.title}</h1>
                            {contract.clientName && contract.clientName !== 'N/A' && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">for {contract.clientName}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {isPreparing ? (
                                <>
                                    <Button variant="secondary" onClick={handleCancel} className="text-xs px-2 py-1.5">Cancel</Button>
                                    <Button onClick={handleSaveAndStartSigning} disabled={!providerHasFieldsToSign || fields.length === 0} className="text-xs px-3 py-1.5">
                                        Sign
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {contract.status === ContractStatus.DRAFT && (
                                        <Button onClick={handlePrepareClick} className="text-xs px-3 py-1.5">Prepare & Sign</Button>
                                    )}
                                    {[ContractStatus.SENT, ContractStatus.VIEWED, ContractStatus.PARTIALLY_SIGNED, ContractStatus.REVISION_REQUESTED].includes(contract.status) && (
                                        <Button onClick={() => setIsProviderSigning(true)} className="text-xs px-3 py-1.5">Sign</Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Desktop contract header - hidden on mobile, contains all action buttons */}
                <div className="hidden md:block sticky top-20 z-30 bg-brand-secondary/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-900/10 dark:border-gray-100/10 -mx-6 sm:-mx-8 lg:-mx-10 px-3 sm:px-6 lg:px-10 py-2 sm:py-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4">
                        <div>
                            <img src="/assets/logo-light-mode.png" alt="SGWL" className="h-12 w-auto mb-4 dark:hidden" />
                            <img src="/assets/logo-dark-mode.png" alt="SGWL" className="h-12 w-auto mb-4 hidden dark:block" />
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                {contract.title}
                                <span className="text-xl font-normal text-gray-400 ml-3">(v{contract.version})</span>
                            </h1>
                            {contract.clientName && contract.clientName !== 'N/A' && (
                                <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">for {contract.clientName}</p>
                            )}
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                            {isEditable && (
                                <Link to={`/contracts/${contract.id}/edit`}>
                                    <Button variant="secondary" className="text-sm">Edit Contract</Button>
                                </Link>
                            )}
                            <Button variant="secondary" onClick={handleDuplicate} className="text-sm">Duplicate</Button>
                            {contract.status === ContractStatus.ARCHIVED ? (
                                <Button variant="secondary" onClick={() => setArchiveModalState({ isOpen: true, action: 'unarchive' })} className="text-sm">Unarchive</Button>
                            ) : (
                                <Button variant="secondary" onClick={() => setArchiveModalState({ isOpen: true, action: 'archive' })} className="text-sm">Archive</Button>
                            )}

                            {[ContractStatus.COMPLETED, ContractStatus.PARTIALLY_SIGNED, ContractStatus.SENT].includes(contract.status) && (
                                <Button
                                    onClick={() => setShowDeliverModal(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white shadow-md text-sm"
                                >
                                    {contract.delivery?.emailSent ? 'Resend' : 'Deliver Project 🚀'}
                                </Button>
                            )}

                            {isPreparing ? (
                                <>
                                    <Button variant="secondary" onClick={handleCancel} className="text-sm px-4 py-2">Cancel</Button>
                                    <Button onClick={handleSaveAndStartSigning} disabled={!providerHasFieldsToSign || fields.length === 0} title={!providerHasFieldsToSign ? "You must place at least one field for yourself (the provider) to continue." : ""} className="text-sm px-4 py-2">
                                        Next: Sign & Send
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {contract.status === ContractStatus.DRAFT && (
                                        <Button onClick={handlePrepareClick} className="text-sm px-4 py-2">Prepare & Sign</Button>
                                    )}
                                    {[ContractStatus.SENT, ContractStatus.VIEWED, ContractStatus.PARTIALLY_SIGNED, ContractStatus.REVISION_REQUESTED].includes(contract.status) && (
                                        <Button onClick={() => setIsProviderSigning(true)} className="text-sm px-4 py-2">Sign Contract</Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {showDeliverModal && contract && (
                    <DeliverProjectModal
                        contract={contract}
                        onClose={() => setShowDeliverModal(false)}
                        onSuccess={(updatedContract) => {
                            setContract(updatedContract);
                            // Optional: Show success toast
                        }}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="contract-viewport">
                            <div
                                id="contract-printable-area"
                                className="contract-document bg-white dark:bg-gray-800 shadow-2xl rounded-lg ring-1 ring-black/5 dark:ring-white/10"
                                aria-label="Contract preview area"
                            >
                                <div
                                    ref={previewRef}
                                    className={`relative p-10 sm:p-14 md:p-18`}
                                >
                                    <ContractPreview contract={contract} isPreparing={isPreparing} />

                                    {isPreparing && fields.map(field => (
                                        <PlacedField
                                            key={field.id}
                                            field={field}
                                            partyName={partyNames[field.partyId] || 'Unassigned'}
                                            onUpdate={handleUpdateField}
                                            onDelete={handleDeleteField}
                                        />
                                    ))}

                                    {!isPreparing && contract.fieldValues && Object.keys(contract.fieldValues).length > 0 && contract.signatureFields.map(field => {
                                        const value = contract.fieldValues![field.id];
                                        if (!value) return null;

                                        const style = {
                                            position: 'absolute' as const,
                                            left: `${field.x}%`,
                                            top: `${field.y}%`,
                                            width: `${field.width}%`,
                                            height: `${field.height}%`,
                                        };

                                        switch (field.kind) {
                                            case SignatureFieldKind.SIGNATURE:
                                            case SignatureFieldKind.INITIAL:
                                                return <img key={field.id} src={value} alt="Signature" style={{ ...style, objectFit: 'contain' }} />;
                                            case SignatureFieldKind.DATE:
                                                return <span key={field.id} style={style} className="flex items-center justify-center font-semibold text-gray-800 text-sm">{value}</span>
                                            case SignatureFieldKind.CHECKBOX:
                                                return <span key={field.id} style={{ ...style, ...{ width: 'auto', height: 'auto' } }} className="text-2xl text-gray-800">✓</span>;
                                            case SignatureFieldKind.TEXT:
                                                return <span key={field.id} style={style} className="flex items-center p-1 font-semibold text-gray-800 text-sm">{value}</span>
                                            default:
                                                return null;
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="sgwl-download-desktop mt-6">
                            <DownloadPdfButton contract={contract} />
                        </div>
                    </div>
                    <div>
                        {renderRightPanel()}
                    </div>
                </div>
            </div>

            <DownloadPdfButton
                contract={contract}
                isFab={true}
            />

            {showSendModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg text-center my-8">
                        <h2 className="text-xl font-bold mb-2 dark:text-white">Contract Signed & Ready!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">The contract has been signed by you. Now, send it to <span className="font-medium text-gray-800 dark:text-gray-100">{contract.clientEmail}</span> for their signature.</p>

                        <div className="mb-6">
                            <SendEmailButton contract={contract} />
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-left mb-6">
                            <label htmlFor="signing-link" className="text-xs font-medium text-gray-700 dark:text-gray-300">Or share this link manually</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <input id="signing-link" type="text" readOnly value={signingLink} className="w-full p-2 border rounded-md bg-white dark:bg-gray-600 dark:border-gray-500 text-sm" />
                                <Button onClick={copyLinkToClipboard}>{isLinkCopied ? 'Copied!' : 'Copy'}</Button>
                            </div>
                        </div>
                        <Button variant="secondary" onClick={() => setShowSendModal(false)}>Close</Button>
                    </div>
                </div>
            )}

            {isProviderSigning && (
                <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
                    {/* Minimal header for mobile */}
                    <header className="flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                        <div className="flex items-center justify-between p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                                <img src="/assets/logo-orange.png" alt="SGWL" className="h-10 sm:h-16 w-auto" />
                                <div className="hidden sm:block">
                                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                        {contract.title}
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Complete your fields to send the contract to the client.</p>
                                </div>
                            </div>
                            <Button variant="secondary" onClick={() => setIsProviderSigning(false)} className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">Cancel</Button>
                        </div>
                    </header>

                    <main className="flex-grow overflow-y-auto">
                        <div className="max-w-4xl mx-auto my-4 sm:my-8">
                            <div className="contract-viewport">
                                <div className="contract-document bg-white shadow-lg rounded-md border">
                                    <div className="relative p-10 sm:p-14 md:p-18">
                                        <ContractPreview contract={contract} />
                                        {renderProviderSigningFields()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    <FieldNavigator
                        totalFields={providerFields.length}
                        completedFields={completedProviderFieldsCount}
                        onNext={handleProviderSignAndSend}
                    />
                </div>
            )}

            {isCanvasOpen && (
                <SignatureCanvas
                    onApply={handleApplyProviderSignature}
                    onClose={() => setIsCanvasOpen(false)}
                />
            )}

            {showSignatureSelection && savedSignatureUrl && (
                <SignatureSelectionModal
                    savedSignatureUrl={savedSignatureUrl}
                    onUseSaved={handleUseSavedSignature}
                    onDrawNew={handleDrawNewSignature}
                    onClose={() => setShowSignatureSelection(false)}
                />
            )}

            {comparisonModalState.isOpen && (
                <VersionComparisonModal
                    isOpen={comparisonModalState.isOpen}
                    onClose={() => setComparisonModalState({ isOpen: false, versions: null })}
                    contract={contract}
                    initialVersionNumbers={comparisonModalState.versions}
                />
            )}

            <ConfirmationModal
                isOpen={archiveModalState.isOpen}
                onClose={() => setArchiveModalState({ isOpen: false, action: null })}
                onConfirm={archiveModalState.action === 'archive' ? handleArchive : handleUnarchive}
                title={archiveModalState.action === 'archive' ? 'Archive Contract' : 'Unarchive Contract'}
                message={archiveModalState.action === 'archive'
                    ? `Are you sure you want to archive "${contract.title}"? It will be moved to the Archives section.`
                    : `Are you sure you want to unarchive "${contract.title}"? It will be restored as a Draft.`}
                confirmButtonText={archiveModalState.action === 'archive' ? 'Archive' : 'Unarchive'}
                confirmButtonVariant="secondary"
            />

            <ConfirmationModal
                isOpen={restoreModalState.isOpen}
                onClose={() => setRestoreModalState({ isOpen: false, versionToRestore: null })}
                onConfirm={handleRestore}
                title="Restore Version"
                message={`Are you sure you want to restore to version ${restoreModalState.versionToRestore}? This will create a new version (${contract.version + 1}) containing the data from version ${restoreModalState.versionToRestore} and revert the contract to a Draft.`}
            />

            <ConfirmationModal
                isOpen={showUnsignedWarning}
                onClose={() => setShowUnsignedWarning(false)}
                onConfirm={() => {
                    setShowUnsignedWarning(false);
                    setIsProviderSigning(true);
                }}
                title="⚠️ Contract Not Signed"
                message="You must sign this contract as admin before sending it to the client. Would you like to sign it now?"
                confirmButtonText="Sign Now"
                confirmButtonVariant="primary"
            />
        </>
    );
};

export default ContractDetail;