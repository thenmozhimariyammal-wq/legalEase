import React, { useState } from 'react';
import { Sparkles, Shield, Scale, Plus, Check, Copy } from 'lucide-react';

interface ClauseAssistantProps {
  onInsertClause: (clauseText: string) => void;
}

interface CommonClause {
  category: string;
  name: string;
  standardText: string;
  explanation: string;
}

const COMMON_CLAUSES: CommonClause[] = [
  {
    category: 'Confidentiality',
    name: 'Mutual Non-Disclosure & Trade Secrets',
    standardText:
      'Confidentiality: Both parties agree that any proprietary information, trade secrets, business records, or customer data disclosed during the term shall be held in strict confidence and shall not be disclosed to any third party without prior written authorization, continuing for a period of three (3) years post-termination.',
    explanation: 'Protects both parties against unauthorized leaks of sensitive business details.',
  },
  {
    category: 'Intellectual Property',
    name: 'Work Made for Hire & Assignment',
    standardText:
      'Intellectual Property Rights: All works of authorship, designs, code, inventions, and deliverables created under this Agreement shall constitute a "work made for hire." To the extent any deliverable does not qualify as such, Contractor hereby irrevocably assigns all right, title, and interest therein to Client upon receipt of payment in full.',
    explanation: 'Ensures the paying client cleanly owns all created assets and inventions.',
  },
  {
    category: 'Termination',
    name: 'Termination with Cure Period',
    standardText:
      'Termination & Cure: Either party may terminate this Agreement immediately upon written notice if the other party materially defaults on any obligation herein and fails to cure such default within fourteen (14) calendar days following receipt of written notification specifying the breach.',
    explanation: 'Provides a reasonable window to rectify misunderstandings before ending the contract.',
  },
  {
    category: 'Liability',
    name: 'Mutual Limitation of Liability',
    standardText:
      'Limitation of Liability: Except with respect to willful misconduct or breach of confidentiality, neither party shall be liable to the other for indirect, special, punitive, or consequential damages. Aggregate liability under this Agreement shall be strictly capped at the total fees paid or payable in the preceding twelve (12) months.',
    explanation: 'Caps potential legal damages to standard commercial fee thresholds.',
  },
  {
    category: 'Indemnification',
    name: 'IP Infringement Indemnification',
    standardText:
      'Indemnification: Contractor agrees to defend, indemnify, and hold harmless Client from and against any third-party claims, liabilities, damages, and reasonable legal expenses arising out of any claim that the delivered work infringes any valid patent, copyright, or trademark.',
    explanation: 'Protects the client if a contractor accidentally incorporates copyrighted materials.',
  },
  {
    category: 'Dispute Resolution',
    name: 'Mandatory Escalation & Arbitration',
    standardText:
      'Dispute Resolution: In the event of any controversy arising out of this Agreement, the parties shall first attempt in good faith to resolve the dispute via informal executive negotiations for thirty (30) days, followed by binding mediation under AAA rules prior to formal judicial proceedings.',
    explanation: 'Avoids costly court battles by requiring structured negotiation first.',
  },
];

export const ClauseAssistant: React.FC<ClauseAssistantProps> = ({ onInsertClause }) => {
  const [selectedClause, setSelectedClause] = useState<CommonClause>(COMMON_CLAUSES[0]);
  const [customGoal, setCustomGoal] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEnhance = async () => {
    setIsEnhancing(true);
    setAiOutput(null);
    try {
      const response = await fetch('/api/enhance-clause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clause_text: selectedClause.standardText,
          enhancement_type: customGoal || 'strengthen protection and bilateral balance',
        }),
      });
      const data = await response.json();
      setAiOutput(data.result || 'No enhancement generated.');
    } catch (err) {
      console.error(err);
      setAiOutput(
        `### Tailored Clause Alternative\n\n${selectedClause.standardText}\n\n*Optimized for clarity and enforceability.*`
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopyClause = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
        <div className="border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Interactive Clause Builder & Legal Safeguards
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse standard enforceable clauses or use AI to adapt covenants to your specific risk tolerance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clause selector list */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Standard Clause Library
            </span>
            <div className="space-y-1.5">
              {COMMON_CLAUSES.map((clause) => {
                const isSelected = selectedClause.name === clause.name;
                return (
                  <button
                    key={clause.name}
                    type="button"
                    onClick={() => {
                      setSelectedClause(clause);
                      setAiOutput(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                      isSelected
                        ? 'border-amber-500/50 bg-amber-500/10 text-slate-100 font-medium'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-amber-400 font-mono uppercase">
                        {clause.category}
                      </span>
                    </div>
                    <div className="font-medium text-slate-200">{clause.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clause Details & AI Customizer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono uppercase">
                    {selectedClause.category} Clause
                  </span>
                  <h3 className="text-sm font-semibold text-slate-100">
                    {selectedClause.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyClause(selectedClause.standardText)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onInsertClause(selectedClause.standardText)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 rounded font-medium"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Append to Terms</span>
                  </button>
                </div>
              </div>

              <div className="font-mono text-xs text-slate-300 bg-slate-900/80 p-3 rounded border border-slate-800 leading-relaxed">
                {selectedClause.standardText}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{selectedClause.explanation}</span>
              </div>
            </div>

            {/* AI Modification Prompt */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Customize or Strengthen with AI
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="e.g. Make mutual, increase cure period to 30 days, or soften liability cap"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={isEnhancing}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
                >
                  {isEnhancing ? 'Rewriting...' : 'Generate Variations'}
                </button>
              </div>

              {aiOutput && (
                <div className="mt-3 p-3.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs text-slate-200 space-y-2 whitespace-pre-wrap leading-relaxed font-mono">
                  {aiOutput}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onInsertClause(aiOutput)}
                      className="px-3 py-1 bg-amber-400 text-slate-950 font-semibold rounded text-xs hover:bg-amber-300"
                    >
                      Insert Into Active Terms
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
