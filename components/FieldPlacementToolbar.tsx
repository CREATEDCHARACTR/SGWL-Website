import React from 'react';
import { ContractParty, SignatureFieldKind } from '../types';

interface FieldPlacementToolbarProps {
  parties: ContractParty[];
  selectedPartyId: string;
  onPartyChange: (partyId: string) => void;
  selectedFieldKind: SignatureFieldKind;
  onFieldChange: (kind: SignatureFieldKind) => void;
}

const FieldPlacementToolbar: React.FC<FieldPlacementToolbarProps> = ({ parties, selectedPartyId, onPartyChange, selectedFieldKind, onFieldChange }) => {
  return (
    <div className="bg-gray-100 p-2 rounded-t-md border-b flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="party-select" className="text-sm font-medium text-gray-700">Assign to:</label>
        <select
          id="party-select"
          value={selectedPartyId}
          onChange={(e) => onPartyChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-1.5"
        >
          {parties.map(party => (
            <option key={party.id} value={party.id}>
              {party.name} ({party.role})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="field-kind-select" className="text-sm font-medium text-gray-700">Field type:</label>
        <select
          id="field-kind-select"
          value={selectedFieldKind}
          onChange={(e) => onFieldChange(e.target.value as SignatureFieldKind)}
           className="rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-1.5"
        >
          {Object.values(SignatureFieldKind).map(kind => (
            <option key={kind} value={kind} className="capitalize">{kind}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FieldPlacementToolbar;