import React, { useState, useMemo, useEffect } from 'react';
import { Contract, ContractVersion } from '../types';
import Button from './ui/Button';
import { getTemplateById } from '../services/geminiService';

interface VersionComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  initialVersionNumbers: [number, number] | null;
}

const diffVariables = (vars1: Record<string, any>, vars2: Record<string, any>) => {
    const allKeys = new Set([...Object.keys(vars1), ...Object.keys(vars2)]);
    const differences: Array<{ key: string; val1: any; val2: any }> = [];

    allKeys.forEach(key => {
        const val1 = vars1[key] ?? '';
        const val2 = vars2[key] ?? '';
        if (String(val1) !== String(val2)) {
            differences.push({ key, val1, val2 });
        }
    });
    return differences;
};

const VersionComparisonModal: React.FC<VersionComparisonModalProps> = ({ isOpen, onClose, contract, initialVersionNumbers }) => {
    const allVersions: ContractVersion[] = useMemo(() => [
        {
            version: contract.version,
            createdAt: contract.updatedAt,
            modifiedBy: 'Current',
            changes: [],
            variables: contract.variables,
        },
        ...(contract.history || []),
    ].sort((a, b) => a.version - b.version), [contract]);
    
    const [selectedV1, setSelectedV1] = useState<number>(initialVersionNumbers ? Math.min(...initialVersionNumbers) : 1);
    const [selectedV2, setSelectedV2] = useState<number>(initialVersionNumbers ? Math.max(...initialVersionNumbers) : contract.version);
    const [templateVariables, setTemplateVariables] = useState<any[]>([]);

    useEffect(() => {
        const fetchTemplate = async () => {
            const template = await getTemplateById(contract.contractType);
            if(template) {
                setTemplateVariables(template.variables);
            }
        };
        fetchTemplate();
    }, [contract.contractType]);

    const version1 = allVersions.find(v => v.version === selectedV1);
    const version2 = allVersions.find(v => v.version === selectedV2);

    const differences = useMemo(() => {
        if (!version1 || !version2) return [];
        return diffVariables(version1.variables, version2.variables);
    }, [version1, version2]);

    const getLabel = (key: string) => templateVariables.find(v => v.name === key)?.label || key;
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl my-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold dark:text-white">Compare Versions</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <select value={selectedV1} onChange={e => setSelectedV1(Number(e.target.value))} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                        {allVersions.map(v => <option key={v.version} value={v.version}>Version {v.version}</option>)}
                    </select>
                    <select value={selectedV2} onChange={e => setSelectedV2(Number(e.target.value))} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                        {allVersions.map(v => <option key={v.version} value={v.version}>Version {v.version}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t dark:border-gray-700 pt-4">
                    <div>
                        <h3 className="font-bold text-lg dark:text-white">Version {selectedV1}</h3>
                        <p className="text-xs text-gray-500">{version1 ? new Date(version1.createdAt).toLocaleString() : ''}</p>
                    </div>
                     <div>
                        <h3 className="font-bold text-lg dark:text-white">Version {selectedV2}</h3>
                        <p className="text-xs text-gray-500">{version2 ? new Date(version2.createdAt).toLocaleString() : ''}</p>
                    </div>
                </div>

                <div className="mt-4 max-h-96 overflow-y-auto pr-2">
                    <h4 className="font-semibold mb-2 dark:text-white">Changes Summary:</h4>
                    {differences.length === 0 ? <p className="text-sm text-gray-500">No differences found between these versions.</p> :
                     <ul className="space-y-3">
                        {differences.map(({ key, val1, val2 }) => (
                            <li key={key} className="p-3 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{getLabel(key)}</p>
                                <div className="grid grid-cols-2 gap-4 mt-1">
                                    <div className="p-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md font-mono break-words">{String(val1)}</div>
                                    <div className="p-2 text-sm bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md font-mono break-words">{String(val2)}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    }
                </div>

                <div className="flex justify-end mt-6">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

export default VersionComparisonModal;