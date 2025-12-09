import React from 'react';
import { Contract, SignatureFieldKind, Template, PartyRole } from '../types';
import { INITIAL_TEMPLATES_DATA } from '../constants';

interface ContractPreviewProps {
  contract: Contract;
  isPreparing?: boolean;
  mode?: 'interactive' | 'pdf';
}

// A simple number to words converter for improved contract clarity
function numberToWords(num: number | string): string {
  const n = parseInt(String(num), 10);
  if (isNaN(n)) return '';

  if (n === 0) return 'zero';

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (n < 20) return ones[n];
  if (n < 100) {
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ones[n % 10] : '');
  }
  if (n < 1000) {
    const hundreds = ones[Math.floor(n / 100)];
    const remainder = n % 100;
    return hundreds + ' hundred' + (remainder !== 0 ? ' ' + numberToWords(remainder) : '');
  }
  // This simple version is likely enough for contract terms.
  return String(n);
}

// Utility to escape HTML characters from user input to prevent XSS
const escapeHtml = (unsafe: string): string => {
  if (typeof unsafe !== 'string') return String(unsafe);
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const ContractPreview: React.FC<ContractPreviewProps> = ({ contract, isPreparing = false, mode = 'interactive' }) => {
  const template = INITIAL_TEMPLATES_DATA.find(t => t.contractType === contract.contractType);

  if (!template) {
    return <div className="p-8">Template not found for this contract type.</div>;
  }

  const displayVariables = {
    ...template.defaultValues,
    ...contract.variables,
    is_project: contract.variables.engagement_type === 'project',
    is_subscription: contract.variables.engagement_type === 'subscription',
  };

  let processedBody = template.bodyMd;

  const isTruthy = (value: any): boolean => {
    if (value === true) return true;
    if (typeof value === 'number') return value > 0;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      return lowerValue !== '' && lowerValue !== 'off' && lowerValue !== 'false' && lowerValue !== 'no';
    }
    return !!value;
  }

  processedBody = processedBody.replace(/{{#if (\w+)}}([\s\S]*?){{else}}([\s\S]*?){{\/if}}/g, (match, varName, ifContent, elseContent) => {
    return isTruthy(displayVariables[varName]) ? ifContent : elseContent;
  });
  processedBody = processedBody.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (match, varName, innerContent) => {
    return isTruthy(displayVariables[varName]) ? innerContent : '';
  });

  for (const key in displayVariables) {
    const value = displayVariables[key];
    let displayValue: any = value;
    const variableDefinition = template.variables.find(v => v.name === key);
    const shouldFormatNumber = variableDefinition &&
      variableDefinition.type === 'number' &&
      (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)))) &&
      !key.toLowerCase().includes('fee') &&
      !key.toLowerCase().includes('rate') &&
      !key.toLowerCase().includes('budget');
    if (shouldFormatNumber) {
      const num = Number(value);
      displayValue = `${num} (${numberToWords(num)})`;
    }
    const safeValue = typeof displayValue === 'string' ? escapeHtml(displayValue) : displayValue;
    processedBody = processedBody.replace(new RegExp(`{{${key}}}`, 'g'), String(safeValue));
  }

  // --- Placeholder Replacement Logic ---
  if (mode === 'pdf') {
    // PDF MODE: Replace placeholders directly with signature images/text for static rendering.
    const partiesToSign = [
      { role: PartyRole.PROVIDER, placeholder_role: 'provider' },
      { role: PartyRole.CLIENT, placeholder_role: 'client' }
    ];

    partiesToSign.forEach(partyInfo => {
      const party = contract.parties.find(p => p.role === partyInfo.role);
      if (!party) return;

      // Handle Signature field
      const sigField = contract.signatureFields.find(f => f.partyId === party.id && f.kind === SignatureFieldKind.SIGNATURE);
      if (sigField && contract.fieldValues?.[sigField.id]) {
        const sigDataUrl = contract.fieldValues[sigField.id];
        const sigImg = `<div style="padding: 10px 0;"><img src="${sigDataUrl}" alt="Signature" style="height: 50px; width: auto; max-width: 250px; display: block;"/></div>`;
        processedBody = processedBody.replace(new RegExp(`{{signature_placeholder_${partyInfo.placeholder_role}}}`, 'g'), sigImg);
      }

      // Handle Date field
      const dateField = contract.signatureFields.find(f => f.partyId === party.id && f.kind === SignatureFieldKind.DATE);
      if (dateField && contract.fieldValues?.[dateField.id]) {
        const dateText = contract.fieldValues[dateField.id];
        const dateSpan = `<span style="font-weight: bold; font-family: sans-serif;">${escapeHtml(dateText)}</span>`;
        processedBody = processedBody.replace(new RegExp(`{{date_placeholder_${partyInfo.placeholder_role}}}`, 'g'), dateSpan);
      }
    });

    // Clean up any unfilled placeholders for the final PDF.
    processedBody = processedBody.replace(/{{(signature|date)_placeholder_(provider|client)}}/g, '<div style="height: 60px; width: 250px; border-bottom: 1px solid #999;"></div>');

  } else {
    // INTERACTIVE PREP & SIGN MODE: Replace placeholders with spans for field placement measurement.
    // We do this in both modes to ensure the document layout (line heights, paragraph spacing)
    // remains exactly the same as when the coordinates were calculated.
    const provider = contract.parties.find(p => p.role === PartyRole.PROVIDER);
    const client = contract.parties.find(p => p.role === PartyRole.CLIENT);
    const placeholderSpan = (partyId: string, kind: SignatureFieldKind) => `<span class="signature-placeholder" data-party-id="${partyId}" data-field-kind="${kind}"></span>`;
    if (provider) {
      processedBody = processedBody.replace(/{{signature_placeholder_provider}}/g, placeholderSpan(provider.id, SignatureFieldKind.SIGNATURE));
      processedBody = processedBody.replace(/{{date_placeholder_provider}}/g, placeholderSpan(provider.id, SignatureFieldKind.DATE));
    }
    if (client) {
      processedBody = processedBody.replace(/{{signature_placeholder_client}}/g, placeholderSpan(client.id, SignatureFieldKind.SIGNATURE));
      processedBody = processedBody.replace(/{{date_placeholder_client}}/g, placeholderSpan(client.id, SignatureFieldKind.DATE));
    }
  }

  const logoUrl = "/assets/logo-light-mode.png";

  const bodyLines = processedBody.split('\n');
  const firstContentfulLineIndex = bodyLines.findIndex(line => line.trim() !== '');
  if (firstContentfulLineIndex !== -1 && bodyLines[firstContentfulLineIndex].trim().startsWith('# ')) {
    bodyLines.splice(firstContentfulLineIndex, 1);
  }

  const processedLinesForHtml: string[] = [];
  let inSignatureBlock = false;
  const signatureBlockHeaders = ['### PROVIDER', '### CLIENT', '### CONTENT CREATOR', '### DEVELOPER'];

  bodyLines.forEach(line => {
    const trimmedLine = line.trim();
    const isSignatureHeader = signatureBlockHeaders.some(header => trimmedLine.startsWith(header));
    if (isSignatureHeader) {
      if (inSignatureBlock) {
        processedLinesForHtml.push('</div>');
      }
      processedLinesForHtml.push('<div class="signature-block">');
      inSignatureBlock = true;
    }
    processedLinesForHtml.push(line);
  });
  if (inSignatureBlock) {
    processedLinesForHtml.push('</div>');
  }

  let formattedHtml = processedLinesForHtml.map(line => {
    if (line.startsWith('<div class="signature-block">') || line === '</div>') return line;
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('<') && trimmedLine.endsWith('>')) return line;
    if (trimmedLine.startsWith('## ')) return `<h2 class="text-lg font-bold mt-8 mb-4 tracking-wide text-gray-700">${escapeHtml(trimmedLine.substring(3))}</h2>`;
    if (trimmedLine.startsWith('### ')) return `<h3 class="text-base font-bold mt-5 mb-3 text-gray-700">${escapeHtml(trimmedLine.substring(4))}</h3>`;
    if (trimmedLine.startsWith('---')) return `<hr class="my-8 border-gray-200" />`;
    if (trimmedLine.startsWith('Date:')) return `<div class="date-block"><p class="mb-5 text-justify">${trimmedLine}</p></div>`;
    if (trimmedLine.length > 0) return `<p class="mb-5 text-justify">${trimmedLine}</p>`;
    return '';
  }).join('\n');

  // Clean up any remaining placeholders for interactive views
  formattedHtml = formattedHtml.replace(/{{(signature|date)_placeholder_(provider|client)}}/g, '');

  const finalHtmlWithContent = `
    <div class="flex flex-col items-center mb-10">
        <img src="${logoUrl}" alt="Company Logo" class="h-24 w-auto object-contain"/>
        <h1 class="text-3xl font-bold text-gray-800 mt-4">SaulGOOD WEATHER Lowery</h1>
    </div>
    <h1 class="text-2xl font-bold text-center mb-10 tracking-wider text-gray-900">${escapeHtml(contract.title)}</h1>
    ${formattedHtml}
  `;

  return (
    <div className="relative">
      <div
        className="bg-white text-gray-900 font-serif text-base leading-relaxed whitespace-normal contract-preview-content"
        dangerouslySetInnerHTML={{ __html: finalHtmlWithContent }}
      />
      {/* The previous absolute positioning logic for PDF generation has been removed. */}
    </div>
  );
};

export default ContractPreview;
