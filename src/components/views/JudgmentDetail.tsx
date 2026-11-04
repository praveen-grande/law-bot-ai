import React, { useState } from 'react';
import {
  ChevronRight,
  Scale,
  Calendar,
  Building,
  Bookmark,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const JudgmentDetail: React.FC = () => {
  const {
    judgments,
    selectedCaseId,
    savedCases,
    toggleBookmarkCase,
    setCurrentView,
    setSelectedSectionId,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ai_summary' | 'overview' | 'text' | 'citations' | 'related'>('ai_summary');

  const currentCase =
    judgments.find((j) => j.id === selectedCaseId) || judgments[0];

  const isSaved = savedCases.includes(currentCase.id);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(`${currentCase.caseTitle}, ${currentCase.citation}`);
    showToast(`Citation copied: "${currentCase.caseTitle}, ${currentCase.citation}"`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* Breadcrumb Header matching Mockup Screen 10 */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <button
          onClick={() => setCurrentView('case_law')}
          className="hover:text-blue-600 font-semibold"
        >
          Case Law
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-slate-900 truncate">{currentCase.caseTitle}</span>
      </div>

      {/* Case Header Card matching Screen 10 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              {currentCase.caseTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
              <span className="font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {currentCase.citation}
              </span>
              <span className="text-blue-700 font-semibold flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                <span>{currentCase.court}</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{currentCase.decisionDate}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => toggleBookmarkCase(currentCase.id)}
              className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isSaved ? 'Saved Case' : 'Save'}</span>
            </button>

            <button
              onClick={handleCopyCitation}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Citation</span>
            </button>

            <a
              href={currentCase.fullJudgmentUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>SCI Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Navigation Tabs matching Screen 10 */}
        <div className="flex items-center gap-4 border-b border-slate-200 text-xs font-semibold pt-2">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'text', label: 'Judgment Text' },
              { id: 'ai_summary', label: 'AI Summary' },
              { id: 'citations', label: 'Citations' },
              { id: 'related', label: 'Related Cases' }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-2.5 transition-colors relative ${
                activeTab === t.id
                  ? 'text-blue-600 font-bold border-b-2 border-blue-600 -mb-[2px]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: AI Summary matching Screen 10 */}
        {activeTab === 'ai_summary' && (
          <div className="space-y-6 pt-2">
            {/* AI Summary Card */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs sm:text-sm text-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI-Generated Executive Summary</span>
              </div>
              <p className="leading-relaxed">{currentCase.aiSummary}</p>
            </div>

            {/* Key Points 1 to 5 matching Screen 10 */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Key Points & Findings</span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">
                  Reportable Holding
                </span>
              </h3>

              <div className="space-y-2 text-xs text-slate-700">
                {currentCase.keyHoldings.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed font-sans">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Provisions Discussed */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Statutory Provisions Discussed in Judgment
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {currentCase.sectionsDiscussed.map((sec, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (sec.includes('420')) {
                        setSelectedSectionId('sec-ipc-420');
                        setCurrentView('acts_sections');
                      } else {
                        showToast(`Viewing ${sec}`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-800 font-medium border border-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>{sec}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Verbatim Judgment Text */}
        {activeTab === 'text' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-serif text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3">
            <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Verbatim Judicial Extract (Official Registry Text)
            </div>
            <p className="italic">{currentCase.judgmentSnippet}</p>
            <p className="text-slate-500 text-xs font-sans pt-2 border-t border-slate-200">
              Bench: {currentCase.bench || 'Division Bench, Supreme Court of India'}. Precedent binding nature: {currentCase.bindingPrecedentStatus}.
            </p>
          </div>
        )}

        {/* Tab 3: Citations */}
        {activeTab === 'citations' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800">Judicial Precedents Cited by the Court:</h4>
            <div className="space-y-2">
              {currentCase.citedCases.map((c, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{c}</span>
                  <span className="text-[11px] text-blue-600 font-medium">Referred with Approval</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Overview */}
        {activeTab === 'overview' && (
          <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 block">Jurisdiction & Authority</span>
              <p>Union of India • Supreme Court of India Appellate Jurisdiction</p>
              <p className="text-slate-500">Date of Decision: {currentCase.decisionDate}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 block">Precedent Status</span>
              <p>{currentCase.bindingPrecedentStatus}</p>
            </div>
          </div>
        )}

        {/* Tab 5: Related */}
        {activeTab === 'related' && (
          <div className="space-y-2 text-xs">
            <div
              onClick={() => {
                showToast('Navigating to related criminal precedent');
              }}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900">Arnesh Kumar v. State of Bihar (2014) 8 SCC 273</div>
                <div className="text-[11px] text-slate-500">Notice under Section 41A CrPC before arrest</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
