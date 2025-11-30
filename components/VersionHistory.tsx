import React from 'react';
import { Contract, ContractVersion } from '../types';
import Button from './ui/Button';

interface VersionHistoryProps {
  contract: Contract;
  onCompare: (v1: number, v2: number) => void;
  onRestore: (versionNumber: number) => void;
  onView: (versionNumber: number) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ contract, onCompare, onRestore, onView }) => {
  const allVersions: ContractVersion[] = [
    {
      version: contract.version,
      createdAt: contract.updatedAt,
      modifiedBy: 'Saul Lowery', 
      changes: [], 
      variables: contract.variables,
    },
    ...(contract.history || []),
  ].sort((a, b) => b.version - a.version);

  const handleCompareClick = () => {
    const lastVersion = contract.version;
    const firstVersion = 1;
    onCompare(Math.min(firstVersion, lastVersion), Math.max(firstVersion, lastVersion));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 dark:text-white">📋 Version History</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {allVersions.map((v) => {
          const isCurrent = v.version === contract.version;
          const isOriginal = v.version === 1;
          const previousVersionNumber = allVersions.find(p => p.version < v.version)?.version;

          return (
            <div key={v.version} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                v{v.version} {isCurrent ? '(Current)' : isOriginal ? '(Original)' : ''}
              </p>
               <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(v.createdAt).toLocaleString()}
                </p>
              <div className="pl-4 mt-1 border-l-2 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300">Modified by: {v.modifiedBy}</p>
                {v.changes.length > 0 && (
                  <p className="text-gray-600 dark:text-gray-300">Changes: {v.changes.length} field{v.changes.length > 1 ? 's' : ''} updated</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {!isOriginal && previousVersionNumber !== undefined && (
                    <button onClick={() => onCompare(v.version, previousVersionNumber)} className="text-brand-primary hover:underline text-xs font-bold">View Changes</button>
                  )}
                  {isOriginal && (
                      <button onClick={() => onView(v.version)} className="text-brand-primary hover:underline text-xs font-bold">View</button>
                  )}
                  {!isCurrent && (
                    <button onClick={() => onRestore(v.version)} className="text-status-signed hover:underline text-xs font-bold">Restore</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {allVersions.length > 1 && (
        <Button variant="secondary" className="w-full mt-4" onClick={handleCompareClick}>
          Compare Versions
        </Button>
      )}
    </div>
  );
};

export default VersionHistory;
