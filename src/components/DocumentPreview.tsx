import React, { useState } from 'react';
import {
  FileText,
  Edit3,
  Download,
  Copy,
  Printer,
  Check,
  CheckCircle2,
  FileCheck,
  Eye,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Info,
} from 'lucide-react';
import { download_docx } from '../utils/docxExport.ts';
import { download_pdf } from '../utils/pdfExport.ts';
import { download_txt } from '../utils/txtExport.ts';
import { sanitize_text } from '../utils/sanitizer.ts';

interface DocumentPreviewProps {
  documentText: string;
  documentType: string;
  termsInput: string;
  onUpdateText: (updated: string) => void;
  onAnalyzeSummary: () => void;
  isLoadingSummary: boolean;
  summaryText?: string;
  isAiGenerated?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentText,
  documentType,
  termsInput,
  onUpdateText,
  onAnalyzeSummary,
  isLoadingSummary,
  summaryText,
  isAiGenerated = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'document' | 'summary'>('document');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setDownloadingDocx(true);
      await download_docx(documentText, documentType, termsInput);
    } catch (err) {
      console.error('Docx download failed', err);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleDownloadPdf = () => {
    try {
      download_pdf(documentText, documentType, termsInput);
    } catch (err) {
      console.error('PDF download failed', err);
    }
  };

  const handleDownloadTxt = () => {
    download_txt(documentText, documentType);
  };

  const handlePrint = () => {
    window.print();
  };

  // Render markdown to clean semantic legal HTML
  const renderFormattedLegalHtml = (text: string) => {
    const lines = sanitize_text(text).split('\n');

    return (
      <div className="space-y-3 font-legal text-slate-200 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-2" />;
          }

          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={idx}
                className="font-cinzel text-lg sm:text-xl font-bold tracking-tight text-amber-300 pt-3 pb-1 border-b border-slate-800"
              >
                {trimmed.replace(/^##\s*/, '')}
              </h2>
            );
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="font-cinzel text-base font-semibold text-slate-100 pt-2"
              >
                {trimmed.replace(/^###\s*/, '')}
              </h3>
            );
          }

          if (
            trimmed === 'WITNESSETH:' ||
            trimmed.startsWith('BETWEEN:') ||
            trimmed.startsWith('AND:') ||
            trimmed.startsWith('NOW, THEREFORE')
          ) {
            return (
              <p key={idx} className="font-semibold text-amber-200/90 tracking-wide text-xs">
                {trimmed}
              </p>
            );
          }

          if (trimmed.startsWith('FIRST PARTY:') || trimmed.startsWith('SECOND PARTY:')) {
            return (
              <div key={idx} className="font-semibold text-amber-300 pt-4 text-xs tracking-wider">
                {trimmed}
              </div>
            );
          }

          if (trimmed.startsWith('____')) {
            return (
              <div key={idx} className="font-mono text-xs text-slate-500 my-1">
                {trimmed}
              </div>
            );
          }

          const bulletMatch = trimmed.match(/^(\d+\.|\([a-z]\)|[•\-\*])\s+(.*)$/);
          if (bulletMatch) {
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-4 py-0.5">
                <span className="font-mono text-xs font-semibold text-amber-400 shrink-0">
                  {bulletMatch[1]}
                </span>
                <span className="text-slate-300">{bulletMatch[2]}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-300">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Success Notification matching PDF page 20 */}
      <div className="flex items-center justify-between rounded-lg bg-emerald-950/80 border border-emerald-500/40 px-4 py-2.5 text-emerald-200 text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="font-medium">Document Generated Successfully!</span>
        </div>
        <span className="text-[11px] text-emerald-400/80 font-mono">
          Ready for Review & Export
        </span>
      </div>

      {/* Main Document Card Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-xl overflow-hidden print-area">
        {/* Document Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 sm:px-6 py-3.5 bg-slate-950/50 no-print">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveViewTab('document')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeViewTab === 'document'
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Document Text</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveViewTab('summary');
                  if (!summaryText && !isLoadingSummary) {
                    onAnalyzeSummary();
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeViewTab === 'summary'
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Plain-English Summary</span>
              </button>
            </div>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-800 rounded-md border border-slate-700 transition-colors"
              title="Copy entire document text"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-800 rounded-md border border-slate-700 transition-colors"
              title="Print formatted contract"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* View Tab 1: Contract Document */}
        {activeViewTab === 'document' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Click to Edit Document Button matching PDF page 14 & 20 */}
            <div className="flex items-center justify-between no-print">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors group cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                <span>{isEditing ? '✓ Done Editing (Switch to Formatted Preview)' : '✎ Click to Edit Document'}</span>
              </button>

              <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                {documentText.split(/\s+/).filter(Boolean).length} words ·{' '}
                {documentText.split('\n').length} lines
              </span>
            </div>

            {/* Editable Text Area or Formatted Preview matching PDF page 14, 20 & 21 */}
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Edit Document Below:</span>
                  <span className="text-[11px] font-mono text-amber-400">Modifications sync with exports</span>
                </div>
                <textarea
                  rows={16}
                  value={documentText}
                  onChange={(e) => onUpdateText(e.target.value)}
                  className="w-full rounded-lg border border-amber-500/50 bg-slate-950 p-4 font-mono text-xs text-slate-200 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 leading-relaxed transition-colors"
                />
              </div>
            ) : (
              /* Styled HTML preview of generated legal document matching PDF page 14 */
              <div className="rounded-lg bg-slate-950/90 border border-slate-800/80 p-6 sm:p-8 max-h-[580px] overflow-y-auto shadow-inner">
                {renderFormattedLegalHtml(documentText)}
              </div>
            )}

            {/* Download Buttons Section matching PDF page 14 & 21-24 */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2 no-print">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Export & Download Options
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Download as .TXT matching PDF page 21 */}
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition-all active:scale-[0.98]"
                >
                  <FileCode className="h-4 w-4 text-slate-400" />
                  <span>Download as .TXT</span>
                </button>

                {/* 2. Download as .DOCX matching PDF page 22 */}
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  disabled={downloadingDocx}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-700/60 transition-all active:scale-[0.98]"
                >
                  {downloadingDocx ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-300 border-t-transparent" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                  )}
                  <span>Download as .DOCX</span>
                </button>

                {/* 3. Download as .PDF matching PDF page 23-24 */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-700/60 transition-all active:scale-[0.98]"
                >
                  <Download className="h-4 w-4 text-rose-400" />
                  <span>Download as .PDF</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>All exports include LegalEase Scales logo, structured terms table & execution blocks.</span>
                <span className="font-mono">PDF & DOCX compliant</span>
              </div>
            </div>
          </div>
        )}

        {/* View Tab 2: Plain English Summary (PDF Page 25) */}
        {activeViewTab === 'summary' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Plain-Language Legal Translation & Risk Breakdown
                </h3>
              </div>
              <button
                type="button"
                onClick={onAnalyzeSummary}
                disabled={isLoadingSummary}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium underline"
              >
                {isLoadingSummary ? 'Analyzing...' : 'Regenerate Analysis'}
              </button>
            </div>

            {isLoadingSummary ? (
              <div className="py-12 text-center space-y-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent mx-auto" />
                <p className="text-xs text-slate-400">
                  Translating legalese into plain English and scanning for risks...
                </p>
              </div>
            ) : summaryText ? (
              <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-5 font-sans-ui text-sm text-slate-300 space-y-3 leading-relaxed whitespace-pre-wrap">
                {summaryText}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <Info className="h-5 w-5 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">
                  Click 'Plain-English Summary' above to run an AI-powered readability and obligation analysis.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
