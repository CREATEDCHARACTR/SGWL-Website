import React from 'react';
import Button from './ui/Button';

interface SignatureSelectionModalProps {
  savedSignatureUrl: string;
  onUseSaved: () => void;
  onDrawNew: () => void;
  onClose: () => void;
}

const SignatureSelectionModal: React.FC<SignatureSelectionModalProps> = ({
  savedSignatureUrl,
  onUseSaved,
  onDrawNew,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-modal-backdrop px-4 py-8 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md text-center my-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Choose Your Signature</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">We found a saved signature. Would you like to use it or draw a new one?</p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-700 my-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Saved Signature:</p>
          <img src={savedSignatureUrl} alt="Saved Signature" className="mx-auto h-24 object-contain" />
        </div>
        <div className="flex flex-col space-y-3">
          <Button onClick={onUseSaved}>Use This Signature</Button>
          <Button variant="secondary" onClick={onDrawNew}>Draw a New One</Button>
          <Button variant="secondary" onClick={onClose} className="mt-2">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default SignatureSelectionModal;