import React from 'react';
import { Scale, FileText, Sparkles, BookOpen, Clock, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'generator' | 'assistant' | 'archive' | 'guide';
  setActiveTab: (tab: 'generator' | 'assistant' | 'archive' | 'guide') => void;
  onNewDocument: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewDocument,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single Brand Element Wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 shadow-sm">
            <Scale className="h-5 w-5" />
          </div>
          <button
            onClick={() => setActiveTab('generator')}
            className="flex flex-col text-left group focus:outline-none"
          >
            <span className="font-cinzel text-xl font-bold tracking-tight text-slate-100 group-hover:text-amber-300 transition-colors">
              LegalEase
            </span>
            <span className="text-[10px] tracking-widest uppercase text-slate-400">
              AI Legal Document Generator
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'generator'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Document Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'assistant'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Clause Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'archive'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Document Library</span>
            {savedCount > 0 && (
              <span className="ml-1 text-[11px] font-mono tabular-nums text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'guide'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Legal Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewDocument}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Document</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </header>
  );
};
