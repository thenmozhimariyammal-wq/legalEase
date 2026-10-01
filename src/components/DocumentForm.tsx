import React from 'react';
import { Sparkles, ArrowRight, Wand2, Calendar, Users, Scale, FileText, CheckCircle2 } from 'lucide-react';
import { DocumentFormData, PresetScenario } from '../types.ts';
import { PRESET_SCENARIOS } from '../data/presetScenarios.ts';

interface DocumentFormProps {
  formData: DocumentFormData;
  onChange: (updated: Partial<DocumentFormData>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onSelectScenario: (scenario: PresetScenario) => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
  onSelectScenario,
}) => {
  // Parse semicolon terms for live preview
  const parsedTerms = (formData.terms || '')
    .split(';')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Quick Scenario Presets Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Quick Templates & PDF Scenarios
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Click to autofill</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PRESET_SCENARIOS.map((sc) => {
            const isSelected =
              formData.documentType.toLowerCase() === sc.formData.documentType.toLowerCase();
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectScenario(sc)}
                className={`text-left p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-amber-500/50 bg-amber-500/10 text-slate-100 shadow-sm'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200 truncate">
                    {sc.title}
                  </span>
                  <span className="text-[10px] text-amber-400/80 font-mono uppercase">
                    {sc.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {sc.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Generator Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-5">
        <div className="border-b border-slate-800/80 pb-4">
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-400" />
            Contract Parameters & Stakeholder Terms
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure parties, key clauses, and effective terms. LegalEase AI drafts comprehensive agreements with enforceability in mind.
          </p>
        </div>

        {/* 1. Document Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Document Type <span className="text-amber-400">*</span>
            <span className="ml-2 text-[11px] text-slate-500 font-normal">
              (Ex. Freelance Work Contract, Employment Contract, NDA, Lease Agreement)
            </span>
          </label>
          <input
            type="text"
            required
            value={formData.documentType}
            onChange={(e) => onChange({ documentType: e.target.value })}
            placeholder="e.g. Freelance Work Contract"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-colors"
          />
        </div>

        {/* 2. Parties Involved */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Parties Involved <span className="text-amber-400">*</span>
            <span className="ml-2 text-[11px] text-slate-500 font-normal">
              (Names, corporate entities & roles)
            </span>
          </label>
          <textarea
            required
            rows={2}
            value={formData.parties}
            onChange={(e) => onChange({ parties: e.target.value })}
            placeholder="e.g. Jane Doe (Service Provider), TechNova Inc. (Client)"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-colors"
          />
        </div>

        {/* 3. Terms & Conditions */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-300">
              Terms & Conditions <span className="text-amber-400">*</span>
              <span className="ml-2 text-[11px] text-amber-400/90 font-mono">
                (Use semicolons ; for bullet points)
              </span>
            </label>
            <span className="text-[11px] font-mono tabular-nums text-slate-400">
              {parsedTerms.length} {parsedTerms.length === 1 ? 'clause' : 'clauses'} identified
            </span>
          </div>

          <textarea
            required
            rows={4}
            value={formData.terms}
            onChange={(e) => onChange({ terms: e.target.value })}
            placeholder="Work must be delivered by May 15, 2025; Payment will be made within 7 days of invoice; The client retains intellectual property rights; Confidentiality must be maintained at all times; Either party may terminate with 15 days notice"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-colors font-sans-ui"
          />

          {/* Semicolon parsed live bullet preview */}
          {parsedTerms.length > 0 && (
            <div className="mt-2 rounded-lg bg-slate-950/80 border border-slate-800 p-2.5 text-xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Parsed Clause Breakdown:
              </span>
              <ul className="space-y-1 text-slate-300">
                {parsedTerms.map((term, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-mono text-[10px] mt-0.5 font-bold">
                      {i + 1}.
                    </span>
                    <span className="leading-snug">{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 4. Dates & Jurisdiction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Effective Date <span className="text-amber-400">*</span>
              <span className="ml-1 text-[11px] text-slate-500 font-normal">
                (When contract becomes active)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.dates}
                onChange={(e) => onChange({ dates: e.target.value })}
                placeholder="e.g. April 15, 2025"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-colors"
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Governing Law / Jurisdiction
              <span className="ml-1 text-[11px] text-slate-500 font-normal">
                (State or Country)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.jurisdiction}
                onChange={(e) => onChange({ jurisdiction: e.target.value })}
                placeholder="e.g. State of California"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-colors"
              />
              <Scale className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 5. Optional Client Instructions */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-medium text-slate-400">
            Special Client Clauses / Instructions (Optional)
          </label>
          <input
            type="text"
            value={formData.additionalNotes || ''}
            onChange={(e) => onChange({ additionalNotes: e.target.value })}
            placeholder="e.g. Include 14-day cure period for breach, net 30 payment terms, or custom audit rights"
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-slate-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold transition-all ${
              isLoading
                ? 'bg-amber-500/50 text-slate-900 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/10 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                <span>Drafting Legal Agreement with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Document</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2">
            Click 'Generate Document' to start AI synthesis. Previews can be edited and exported to TXT, DOCX, or PDF.
          </p>
        </div>
      </form>
    </div>
  );
};
