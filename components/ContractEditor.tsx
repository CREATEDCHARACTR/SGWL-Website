import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getContractById, updateContract } from '../services/geminiService';
import { Contract, ContractStatus, AuditEventType, PartyRole, TemplateType, QuestionFlowItem, ChangeRecord, ContractVersion, AuditEvent, Variable } from '../types';
import {
    PHOTOGRAPHY_QUESTION_FLOW, AI_AGENT_QUESTION_FLOW, PHOTO_VIDEO_SUBSCRIPTION_QUESTION_FLOW,
    PHOTOGRAPHY_VARIABLES, VIDEOGRAPHY_VARIABLES, WEBSITE_VARIABLES, AI_AGENT_VARIABLES, PHOTO_VIDEO_SUBSCRIPTION_VARIABLES
} from '../constants';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

const questionFlowMap: Record<TemplateType, QuestionFlowItem[]> = {
    [TemplateType.PHOTOGRAPHY]: PHOTOGRAPHY_QUESTION_FLOW,
    [TemplateType.VIDEOGRAPHY]: [], // Placeholder for future implementation
    [TemplateType.WEBSITE]: [], // Placeholder for future implementation
    [TemplateType.AI_AGENT]: AI_AGENT_QUESTION_FLOW,
    [TemplateType.PHOTO_VIDEO_SUBSCRIPTION]: PHOTO_VIDEO_SUBSCRIPTION_QUESTION_FLOW,
    [TemplateType.GENERAL]: [],
};

const variableMap: Record<TemplateType, Variable[]> = {
    [TemplateType.PHOTOGRAPHY]: PHOTOGRAPHY_VARIABLES,
    [TemplateType.VIDEOGRAPHY]: VIDEOGRAPHY_VARIABLES,
    [TemplateType.WEBSITE]: WEBSITE_VARIABLES,
    [TemplateType.AI_AGENT]: AI_AGENT_VARIABLES,
    [TemplateType.PHOTO_VIDEO_SUBSCRIPTION]: PHOTO_VIDEO_SUBSCRIPTION_VARIABLES,
    [TemplateType.GENERAL]: [],
};

const ContractEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [originalContract, setOriginalContract] = useState<Contract | null>(null);
    const [currentValues, setCurrentValues] = useState<Record<string, any>>({});
    const [changes, setChanges] = useState<ChangeRecord[]>([]);
    const [questionFlow, setQuestionFlow] = useState<QuestionFlowItem[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [step, setStep] = useState<'loading' | 'asking' | 'review'>('loading');
    const [isUpdatingField, setIsUpdatingField] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return navigate('/dashboard');
            try {
                const contractData = await getContractById(id);
                if (contractData) {
                    setOriginalContract(contractData);
                    setCurrentValues(contractData.variables);
                    const flow = questionFlowMap[contractData.contractType] || [];
                    setQuestionFlow(flow);
                    setStep('asking');
                } else {
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error("Error loading contract for editing:", error);
                navigate(`/contracts/${id}`);
            }
        };
        loadData();
    }, [id, navigate]);

    useEffect(() => {
        if (isUpdatingField) {
            inputRef.current?.focus();
        }
    }, [isUpdatingField]);

    const findNextQuestionIndex = (startIndex: number, values: Record<string, any>): number => {
        for (let i = startIndex; i < questionFlow.length; i++) {
            const question = questionFlow[i];
            if (!question.condition || question.condition(values)) {
                return i;
            }
        }
        return -1; // No more questions
    };

    const advanceToNextQuestion = () => {
        const nextIndex = findNextQuestionIndex(questionIndex + 1, currentValues);
        if (nextIndex === -1) {
            setStep('review');
        } else {
            setQuestionIndex(nextIndex);
        }
        setIsUpdatingField(false);
        setInputValue('');
    };

    const handleKeepAnswer = () => {
        advanceToNextQuestion();
    };

    const handleUpdateClick = () => {
        const currentQuestion = questionFlow[questionIndex];
        setInputValue(currentValues[currentQuestion.key] || '');
        setIsUpdatingField(true);
    };

    const handleConfirmUpdate = () => {
        const currentQuestion = questionFlow[questionIndex];
        const oldValue = originalContract?.variables[currentQuestion.key];

        // Determine type and cast if necessary
        const variables = variableMap[originalContract?.contractType as TemplateType] || [];
        const variableDef = variables.find(v => v.name === currentQuestion.key);
        let newValue: any = inputValue;

        if (variableDef && (variableDef.type === 'number' || variableDef.type === 'percentage')) {
            newValue = inputValue === '' ? '' : Number(inputValue);
        }

        if (String(oldValue) !== String(newValue)) {
            setCurrentValues(prev => ({ ...prev, [currentQuestion.key]: newValue }));
            setChanges(prev => [
                ...prev.filter(c => c.field !== currentQuestion.key), // Remove previous change for this field if any
                { field: currentQuestion.key, label: currentQuestion.question, before: oldValue, after: newValue }
            ]);
        }
        advanceToNextQuestion();
    };

    const handleSaveRevision = async () => {
        if (!originalContract) return;
        setIsSaving(true);

        const now = new Date().toISOString();

        // Create a snapshot of the version being replaced
        const previousVersionSnapshot: ContractVersion = {
            version: originalContract.version,
            createdAt: originalContract.updatedAt,
            modifiedBy: "Saul Lowery", // Assuming the admin is the one editing
            changes: [], // This snapshot represents the state *before* this edit
            variables: originalContract.variables,
        };

        const newAuditEvent: AuditEvent = {
            id: `aud_${Date.now()}`,
            eventType: AuditEventType.REVISED,
            createdAt: now,
            ip: '192.168.1.1', // Mock IP
            userAgent: navigator.userAgent,
            meta: { fromVersion: originalContract.version, toVersion: originalContract.version + 1, changes: changes.length }
        };

        const clientName = currentValues.client_legal_name || originalContract.clientName;
        const clientEmail = currentValues.client_email || originalContract.clientEmail;

        const revisedContract: Contract = {
            ...originalContract,
            title: currentValues.project_title || originalContract.title,
            clientName,
            clientEmail,
            variables: currentValues,
            version: originalContract.version + 1,
            status: ContractStatus.DRAFT, // Revert to draft for re-approval
            updatedAt: now,
            fieldValues: {}, // Clear previous signatures
            signatureFields: [], // Clear field placements as content has changed
            auditTrail: [...(originalContract.auditTrail || []), newAuditEvent],
            history: [...(originalContract.history || []), previousVersionSnapshot],
            parties: originalContract.parties.map(p => {
                if (p.role === PartyRole.CLIENT) {
                    return { ...p, name: clientName, email: clientEmail };
                }
                return p;
            }),
        };

        await updateContract(revisedContract);
        setIsSaving(false);
        navigate(`/contracts/${originalContract.id}`);
    };

    const currentQuestion = questionFlow[questionIndex];

    if (step === 'loading' || !originalContract) {
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading contract editor...</div>;
    }

    if (step === 'review') {
        return (
            <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Review Changes</h1>
                <Card>
                    <div className="p-8">
                        {changes.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400">No changes were made to the contract.</p>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold dark:text-white">{changes.length} field{changes.length > 1 ? 's' : ''} updated</h3>
                                <ul className="divide-y dark:divide-gray-700">
                                    {changes.map(change => (
                                        <li key={change.field} className="py-3">
                                            <p className="font-medium text-gray-800 dark:text-gray-200">{change.label}</p>
                                            <div className="grid grid-cols-2 gap-4 mt-1 text-sm">
                                                <div>
                                                    <span className="text-xs text-red-500">BEFORE</span>
                                                    <p className="p-2 bg-red-50 dark:bg-red-900/30 rounded font-mono text-red-800 dark:text-red-200">{String(change.before)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-green-500">AFTER</span>
                                                    <p className="p-2 bg-green-50 dark:bg-green-900/30 rounded font-mono text-green-800 dark:text-green-200">{String(change.after)}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Card>
                <div className="flex justify-end items-center gap-4">
                    <Link to={`/contracts/${id}`}>
                        <Button variant="secondary">{changes.length > 0 ? 'Cancel All Changes' : 'Back to Contract'}</Button>
                    </Link>
                    {changes.length > 0 && (
                        <Button onClick={handleSaveRevision} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Revision'}
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Editing Contract</h1>
            <Card>
                <div className="p-8 text-center">
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Step {questionIndex + 1} of {questionFlow.length}</p>
                        <h2 className="text-2xl font-semibold dark:text-white mt-1">{currentQuestion.question}</h2>
                    </div>

                    {!isUpdatingField ? (
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg my-6">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Value</p>
                            <p className="text-lg font-mono text-gray-800 dark:text-gray-100 mt-1">{String(currentValues[currentQuestion.key] ?? 'Not set')}</p>
                        </div>
                    ) : (
                        <div className="my-6">
                            <Input
                                ref={inputRef}
                                id="edit-input"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleConfirmUpdate()}
                            />
                        </div>
                    )}

                    <div className="flex justify-center gap-4">
                        {!isUpdatingField ? (
                            <>
                                <Button onClick={handleKeepAnswer} variant="secondary">Keep Current Answer</Button>
                                <Button onClick={handleUpdateClick} className="bg-orange-500 hover:bg-orange-600 focus:ring-orange-500">Update Answer</Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setIsUpdatingField(false)} variant="secondary">Cancel Update</Button>
                                <Button onClick={handleConfirmUpdate}>Confirm Change</Button>
                            </>
                        )}
                    </div>
                </div>
            </Card>
            <div className="text-center">
                <Button variant="secondary" onClick={() => setStep('review')}>Skip to Review</Button>
            </div>
        </div>
    );
};

export default ContractEditor;