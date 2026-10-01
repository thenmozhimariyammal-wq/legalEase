import React, { useState, useEffect } from 'react';
import { Scale, Sparkles, FileText, CheckCircle2, Shield, ArrowDown, ChevronRight } from 'lucide-react';
import { Header } from './components/Header.tsx';
import { DocumentForm } from './components/DocumentForm.tsx';
import { DocumentPreview } from './components/DocumentPreview.tsx';
import { ClauseAssistant } from './components/ClauseAssistant.tsx';
import { DocumentLibrary } from './components/DocumentLibrary.tsx';
import { LegalGuide } from './components/LegalGuide.tsx';
import { DocumentFormData, PresetScenario, GeneratedDocumentItem } from './types.ts';
import { PRESET_SCENARIOS } from './data/presetScenarios.ts';

const STORAGE_KEY = 'legalease_saved_documents_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'assistant' | 'archive' | 'guide'>('generator');

  // Default form state initialized with Scenario 4 from the PDF specification
  const [formData, setFormData] = useState<DocumentFormData>({
    documentType: 'Freelance Work Contract',
    parties: 'Jane Doe (Service Provider), TechNova Inc. (Client)',
    terms:
      'Work must be delivered by May 15, 2025; Payment will be made within 7 days of invoice; The client retains intellectual property rights; Confidentiality must be maintained at all times; Either party may terminate with 15 days notice',
    dates: 'April 15, 2025',
    jurisdiction: 'State of California',
    additionalNotes: 'Specify independent contractor status and 14-day breach cure period.',
  });

  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryText, setSummaryText] = useState<string | undefined>(undefined);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState<GeneratedDocumentItem[]>([]);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Load saved documents from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedDocuments(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Failed to read from localStorage:', err);
    }
  }, []);

  const saveToStorage = (updatedDocs: GeneratedDocumentItem[]) => {
    setSavedDocuments(updatedDocs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  };

  const handleUpdateFormData = (updated: Partial<DocumentFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectScenario = (scenario: PresetScenario) => {
    setFormData({ ...scenario.formData });
    setActiveTab('generator');
  };

  const handleNewDocument = () => {
    setFormData({
      documentType: '',
      parties: '',
      terms: '',
      dates: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      jurisdiction: 'State of California',
      additionalNotes: '',
    });
    setGeneratedText(null);
    setSummaryText(undefined);
    setErrorNotice(null);
    setActiveTab('generator');
  };

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    setErrorNotice(null);
    setSummaryText(undefined);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: formData.documentType,
          parties: formData.parties,
          terms: formData.terms,
          dates: formData.dates,
          jurisdiction: formData.jurisdiction,
          additional_instructions: formData.additionalNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate document');
      }

      const data = await response.json();
      const content = data.document;
      setGeneratedText(content);

      // Save to document history
      const newDocItem: GeneratedDocumentItem = {
        id: `doc_${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: `${formData.documentType} - ${formData.parties.split(',')[0]}`,
        documentType: formData.documentType,
        parties: formData.parties,
        dates: formData.dates,
        terms: formData.terms,
        content: content,
      };

      const updatedList = [newDocItem, ...savedDocuments.filter((d) => d.id !== newDocItem.id)].slice(0, 30);
      saveToStorage(updatedList);

      // Smooth scroll down to preview
      setTimeout(() => {
        const previewElement = document.getElementById('preview-section');
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } catch (err: any) {
      console.error('Document generation error:', err);
      setErrorNotice(err.message || 'Error communicating with generation engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeSummary = async () => {
    if (!generatedText) return;
    setIsLoadingSummary(true);
    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_text: generatedText }),
      });
      const data = await response.json();
      setSummaryText(data.summary || 'Summary unavailable.');
    } catch (err) {
      console.error('Summary error:', err);
      setSummaryText('Failed to generate summary.');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleInsertClause = (clauseText: string) => {
    const currentTerms = formData.terms.trim();
    const updated = currentTerms ? `${currentTerms}; ${clauseText}` : clauseText;
    setFormData((prev) => ({ ...prev, terms: updated }));
    setActiveTab('generator');
  };

  const handleSelectSavedDocument = (doc: GeneratedDocumentItem) => {
    setFormData({
      documentType: doc.documentType,
      parties: doc.parties,
      terms: doc.terms,
      dates: doc.dates,
      jurisdiction: 'State of California',
    });
    setGeneratedText(doc.content);
    setSummaryText(doc.summary);
    setActiveTab('generator');
  };

  const handleDeleteSavedDocument = (id: string) => {
    const updated = savedDocuments.filter((d) => d.id !== id);
    saveToStorage(updated);
  };

  const handleClearAllSaved = () => {
    if (confirm('Are you sure you want to clear your saved document library?')) {
      saveToStorage([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans-ui">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewDocument={handleNewDocument}
        savedCount={savedDocuments.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner with Scales Logo & Title matching PDF page 18 */}
        {activeTab === 'generator' && (
          <div className="flex flex-col items-center justify-center text-center space-y-2 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-amber-400/20 to-amber-600/5 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/5 mb-1">
              <Scale className="h-8 w-8" />
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              LegalEase
            </h1>
            <h2 className="text-sm font-medium text-slate-400 tracking-wide uppercase">
              AI Legal Document Generator
            </h2>
            <p className="max-w-xl text-xs text-slate-400">
              Generate enforceable, tailored contracts, employment agreements, NDAs, and leases with structured clauses, live editable previews, and multi-format exports (.PDF, .DOCX, .TXT).
            </p>
          </div>
        )}

        {/* Error notification if any */}
        {errorNotice && (
          <div className="rounded-lg bg-rose-950/80 border border-rose-500/50 p-3.5 text-xs text-rose-200 flex items-center justify-between">
            <span>{errorNotice}</span>
            <button
              onClick={() => setErrorNotice(null)}
              className="text-rose-400 hover:text-rose-200 underline font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Document Generator View */}
        {activeTab === 'generator' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Input Form (Takes full or 5 cols depending on preview) */}
              <div className={generatedText ? 'lg:col-span-5' : 'lg:col-span-12 max-w-3xl mx-auto w-full'}>
                <DocumentForm
                  formData={formData}
                  onChange={handleUpdateFormData}
                  onSubmit={handleGenerateDocument}
                  isLoading={isGenerating}
                  onSelectScenario={handleSelectScenario}
                />
              </div>

              {/* Right Column: Preview and Export (when generated) */}
              {generatedText && (
                <div id="preview-section" className="lg:col-span-7">
                  <DocumentPreview
                    documentText={generatedText}
                    documentType={formData.documentType}
                    termsInput={formData.terms}
                    onUpdateText={(text) => setGeneratedText(text)}
                    onAnalyzeSummary={handleAnalyzeSummary}
                    isLoadingSummary={isLoadingSummary}
                    summaryText={summaryText}
                  />
                </div>
              )}
            </div>

            {/* Prompt for users if they haven't generated yet */}
            {!generatedText && (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center space-y-3">
                <FileText className="h-10 w-10 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-300">
                    Ready to Generate Your Legal Agreement
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Fill in the contract parameters above or pick one of the quick scenario presets, then click <strong className="text-amber-400">Generate Document</strong> to view the formatted legal output and export to PDF, DOCX, or TXT.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Interactive Clause Assistant */}
        {activeTab === 'assistant' && (
          <ClauseAssistant onInsertClause={handleInsertClause} />
        )}

        {/* Tab 3: Document Archive */}
        {activeTab === 'archive' && (
          <DocumentLibrary
            documents={savedDocuments}
            onSelectDocument={handleSelectSavedDocument}
            onDeleteDocument={handleDeleteSavedDocument}
            onClearAll={handleClearAllSaved}
          />
        )}

        {/* Tab 4: Legal Guide */}
        {activeTab === 'guide' && <LegalGuide />}
      </main>

      {/* Footer matching LegalEase standard */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 no-print">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-amber-500" />
            <span className="font-cinzel font-semibold text-slate-300">LegalEase</span>
            <span className="text-slate-600">·</span>
            <span>AI Legal Document Generator</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Built with Gemini & Full-Stack Node</span>
            <span>·</span>
            <span>Export: .PDF · .DOCX · .TXT</span>
          </div>
          <p className="text-[11px] text-slate-600">
            LegalEase Inc. | contact@legalease.com | All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
