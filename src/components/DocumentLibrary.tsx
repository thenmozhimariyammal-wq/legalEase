import React, { useState } from 'react';
import {
  Clock,
  Trash2,
  ExternalLink,
  FileCode,
  FileSpreadsheet,
  Download,
  Search,
  BookOpen,
  Calendar,
  Users,
} from 'lucide-react';
import { GeneratedDocumentItem } from '../types.ts';
import { download_docx } from '../utils/docxExport.ts';
import { download_pdf } from '../utils/pdfExport.ts';
import { download_txt } from '../utils/txtExport.ts';

interface DocumentLibraryProps {
  documents: GeneratedDocumentItem[];
  onSelectDocument: (doc: GeneratedDocumentItem) => void;
  onDeleteDocument: (id: string) => void;
  onClearAll: () => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  onSelectDocument,
  onDeleteDocument,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = documents.filter((doc) => {
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.documentType.toLowerCase().includes(q) ||
      doc.parties.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-semibold text-slate-100">
                Document Archive & Generated History
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Access your drafted contracts, review previous terms, and re-export in any format.
            </p>
          </div>

          {documents.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Archive</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by contract title, party name, or document type..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center space-y-3 rounded-lg border border-dashed border-slate-800 bg-slate-950/40">
            <BookOpen className="h-8 w-8 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-300">
                {documents.length === 0 ? 'No Generated Documents Yet' : 'No Matching Documents Found'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {documents.length === 0
                  ? 'Generate your first agreement in the Document Generator tab to save it to your local workspace.'
                  : 'Try adjusting your search criteria.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group rounded-lg border border-slate-800 bg-slate-950/80 p-4 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[10px] text-amber-400 font-mono">
                        {item.documentType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-slate-500" />
                        <span>{item.parties}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        <span>Effective: {item.dates}</span>
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-start">
                    <button
                      type="button"
                      onClick={() => onSelectDocument(item)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Open in Editor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteDocument(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded hover:bg-slate-900"
                      title="Delete from archive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-500">Instant Export:</span>
                  <button
                    type="button"
                    onClick={() => download_txt(item.content, item.documentType)}
                    className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition-colors"
                  >
                    <FileCode className="h-3 w-3 text-slate-400" />
                    <span>.TXT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => download_docx(item.content, item.documentType, item.terms)}
                    className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 rounded transition-colors"
                  >
                    <FileSpreadsheet className="h-3 w-3 text-emerald-400" />
                    <span>.DOCX</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => download_pdf(item.content, item.documentType, item.terms)}
                    className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/40 rounded transition-colors"
                  >
                    <Download className="h-3 w-3 text-rose-400" />
                    <span>.PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
