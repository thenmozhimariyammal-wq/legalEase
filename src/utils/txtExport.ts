import { sanitize_text } from './sanitizer.ts';

/**
 * Downloads document as clean formatted .txt plain text file matching PDF page 21
 */
export function download_txt(rawText: string, docType: string): void {
  const sanitized = sanitize_text(rawText);

  // Add header & footer banner matching PDF specifications
  const header = `================================================================================
LEGAL DOCUMENT: ${(docType || 'AGREEMENT').toUpperCase()}
GENERATED VIA: LegalEase AI Legal Document Generator
DATE EXPORTED: ${new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
================================================================================

`;

  const footer = `

================================================================================
LegalEase Inc. | contact@legalease.com | All Rights Reserved
================================================================================`;

  const fullContent = header + sanitized + footer;
  const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
  const fileName = `${docType.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
