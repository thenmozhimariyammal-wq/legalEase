import React from 'react';
import { BookOpen, CheckCircle, ShieldCheck, Scale, FileText, AlertTriangle } from 'lucide-react';

export const LegalGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-100">
              LegalEase Drafting Architecture & Enforceability Guide
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            A guide to understanding formal contract structures, drafting conventions, and how AI-generated legal covenants remain legally protective.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-medium text-sm">
              <FileText className="h-4 w-4" />
              <span>1. Title & Preamble</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every contract opens with a distinct legal title and preamble establishing the agreement date, the precise legal names of all participating individuals or registered entities, their business addresses, and designated roles (e.g., Client, Contractor, Landlord).
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
              <BookOpen className="h-4 w-4" />
              <span>2. Recitals ("WITNESSETH / WHEREAS")</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recitals describe the commercial context and business purpose behind the transaction. While not legally operative on their own, courts rely on recitals to interpret ambiguous provisions and verify mutual consideration.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-medium text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>3. Operative Covenants & Schedule A</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Numbered clauses outlining concrete duties, deadlines, deliverables, compensation, intellectual property transfer, confidentiality terms, and termination notice periods. LegalEase automatically maps semicolon-separated terms into both clauses and Schedule A tables.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-medium text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>4. Execution & Signatures</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To achieve legal validity under common law, contracts must be executed by authorized signatories. LegalEase appends dual signature blocks with lines for signature, printed name, corporate title, and execution date.
            </p>
          </div>
        </div>

        {/* Enforceability Checklist */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            Legal Enforceability Best Practices
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Explicit Dates & Deadlines:</strong> Avoid vague phrases like "as soon as possible". Specify exact dates (e.g. May 15, 2025) or measurable business day intervals.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Cure Period for Breach:</strong> Include a standard notice and cure window (typically 14 to 30 days) allowing a party to rectify a technical default before facing termination.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Governing Law:</strong> Always designate a specific state or jurisdiction whose courts and statutory laws will govern interpretations and dispute resolution.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Severability:</strong> Protect the remainder of the contract by providing that if one clause is held invalid by a court, the rest of the agreement remains in full effect.</span>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong>Legal Notice:</strong> LegalEase is an AI-powered legal document generation platform designed to accelerate drafting and improve contract literacy. While templates adhere to recognized legal structures, users are advised to review specialized or high-value contracts with qualified legal counsel in their respective jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};
