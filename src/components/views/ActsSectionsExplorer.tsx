import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Share2,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Search,
  Scale,
  Sparkles,
  ArrowRight,
  Gavel,
  Landmark
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/translations';

export const ActsSectionsExplorer: React.FC = () => {
  const {
    sections,
    selectedSectionId,
    setSelectedSectionId,
    savedSections,
    toggleBookmarkSection,
    setSelectedCaseId,
    setCurrentView,
    language,
    showToast
  } = useApp();

  const t = getTranslation(language).acts;
  const [activeTab, setActiveTab] = useState<'related' | 'amendments' | 'judgments'>('related');
  const [sectionSearch, setSectionSearch] = useState('');

  const currentSection =
    sections.find((s) => s.id === selectedSectionId) || sections[0];

  const isBookmarked = savedSections.includes(currentSection.id);

  const handleCopyCitation = () => {
    const citation = `${currentSection.actName}, Section ${currentSection.sectionNumber} (India Code)`;
    navigator.clipboard.writeText(citation);
    showToast(`Citation copied: "${citation}"`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link to section copied to clipboard');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-100/70 text-slate-800">
      {/* Official Breadcrumb Header */}
      <div className="bg-white border-b border-slate-300 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs shrink-0 shadow-2xs">
        <div className="flex items-center gap-1.5 text-slate-600 overflow-x-auto">
          <span className="font-bold text-[#0b2239] font-serif uppercase tracking-wider">{t.explorerTitle}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#0b2239]">{currentSection.actName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#0b2239] font-bold font-mono">{t.sectionPrefix} {currentSection.sectionNumber}</span>
        </div>

        <a
          href={currentSection.officialSourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[#0b2239] hover:text-[#123253] font-bold flex items-center gap-1 shrink-0"
        >
          <span>{t.repoLink}</span>
          <ExternalLink className="w-3 h-3 text-amber-700" />
        </a>
      </div>

      {/* Main Split Body: Left Section Tree & Right Section Detail */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tree Navigator */}
        <aside className="w-72 bg-white border-r border-slate-300 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-[#0b2239] text-xs mb-2 font-serif">
              {currentSection.actName}
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={sectionSearch}
                onChange={(e) => setSectionSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-2xs border border-slate-300 focus:border-[#0b2239] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-2 space-y-4 text-xs">
            <div>
              <div className="px-2 py-1 font-bold text-slate-500 uppercase tracking-wider text-[10px] font-serif">
                {currentSection.chapterNumber} — {currentSection.chapterTitle}
              </div>

              <div className="space-y-0.5 mt-1">
                {sections
                  .filter((sec) => !sectionSearch || sec.title.toLowerCase().includes(sectionSearch.toLowerCase()) || sec.sectionNumber.includes(sectionSearch))
                  .map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedSectionId(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-2xs font-medium transition-colors flex items-start gap-2 ${
                        sec.id === currentSection.id
                          ? 'bg-[#0b2239] text-amber-300 shadow-2xs font-bold border-l-3 border-amber-400'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-mono text-[11px] shrink-0 font-bold">
                        {sec.sectionNumber}
                      </span>
                      <span className="truncate text-xs">{sec.title}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center Main Statutory Reader */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Section Header & Official Stamps */}
            <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`gov-stamp ${
                      currentSection.status === 'In Force'
                        ? 'gov-stamp-active'
                        : 'border-red-500 bg-red-50 text-red-800'
                    }`}
                  >
                    ● {currentSection.status}
                  </span>
                  <span className="gov-stamp gov-stamp-central">
                    {currentSection.jurisdiction} Act
                  </span>
                  <span className="gov-stamp gov-stamp-gold">
                    {currentSection.actName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => toggleBookmarkSection(currentSection.id)}
                    className={`px-3 py-1.5 rounded-2xs border font-bold flex items-center gap-1.5 transition-colors ${
                      isBookmarked
                        ? 'bg-amber-50 text-amber-900 border-amber-400'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span>{isBookmarked ? t.bookmarked : t.bookmark}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="px-3 py-1.5 rounded-2xs border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{t.share}</span>
                  </button>

                  <button
                    onClick={handleCopyCitation}
                    className="px-3 py-1.5 rounded-2xs border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyCitation}</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500 font-mono">
                  {t.sectionPrefix} {currentSection.sectionNumber}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0b2239] mt-1">
                  {currentSection.title}
                </h1>
              </div>

              {/* Official Statutory Text in Classical Gazette Typography */}
              <div className="p-5 rounded-2xs bg-[#fdfcf9] border border-[#d6d3cd] text-xs sm:text-sm text-slate-900 font-serif leading-relaxed shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-2 font-sans flex items-center gap-1.5 border-b border-[#e5e2da] pb-1">
                  <Gavel className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.statutoryTextLabel}</span>
                </div>
                <p className="whitespace-pre-line">{currentSection.statutoryText}</p>
                {currentSection.punishment && (
                  <div className="mt-4 pt-3 border-t border-[#e5e2da] text-xs font-sans text-slate-800">
                    <span className="font-bold text-[#0b2239]">{t.prescribedPenalty} </span>
                    <span>{currentSection.punishment}</span>
                  </div>
                )}
              </div>

              {/* Explanation in Simple Language Callout Box */}
              <div className="p-4 rounded-2xs bg-slate-50 border border-slate-300 text-xs text-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#0b2239] text-xs font-serif uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{t.simpleExplanation}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {currentSection.simpleExplanation}
                </p>
                {currentSection.keyIngredients && (
                  <div className="pt-2">
                    <div className="font-bold text-slate-900 text-[11px] mb-1">
                      {t.keyIngredients}
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                      {currentSection.keyIngredients.map((elem: string, idx: number) => (
                        <li key={idx}>{elem}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sub-Tabs: Related Sections, Amendments, Judgments */}
            <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-2xs space-y-4">
              <div className="flex border-b border-slate-300 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('related')}
                  className={`pb-2.5 px-4 border-b-2 transition-all ${
                    activeTab === 'related'
                      ? 'border-[#0b2239] text-[#0b2239]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  संबंधित धाराएं (Related Sections)
                </button>
                <button
                  onClick={() => setActiveTab('amendments')}
                  className={`pb-2.5 px-4 border-b-2 transition-all ${
                    activeTab === 'amendments'
                      ? 'border-[#0b2239] text-[#0b2239]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  संशोधन इतिहास (Amendments)
                </button>
                <button
                  onClick={() => setActiveTab('judgments')}
                  className={`pb-2.5 px-4 border-b-2 transition-all ${
                    activeTab === 'judgments'
                      ? 'border-[#0b2239] text-[#0b2239]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  प्रमुख निर्णय (Landmark Precedents)
                </button>
              </div>

              {activeTab === 'related' && (
                <div className="space-y-2 text-xs">
                  {currentSection.relatedSections.map((relSecNum: string) => {
                    const relSec = sections.find((s) => s.sectionNumber === relSecNum || s.id === relSecNum);
                    return (
                      <div
                        key={relSecNum}
                        onClick={() => relSec && setSelectedSectionId(relSec.id)}
                        className="p-3 rounded-2xs bg-slate-50 border border-slate-200 hover:border-[#0b2239] flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div>
                          <div className="font-bold text-[#0b2239]">
                            Section {relSec ? relSec.sectionNumber : relSecNum} {relSec ? `— ${relSec.title}` : ''}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {relSec ? relSec.simpleExplanation : 'Related section within Indian Penal Code'}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'amendments' && (
                <div className="space-y-3 text-xs">
                  {currentSection.amendmentHistory && currentSection.amendmentHistory.length > 0 ? (
                    currentSection.amendmentHistory.map((amend: string, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xs border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0b2239]">{amend}</span>
                          <span className="gov-stamp gov-stamp-central text-[9px]">Gazette</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-slate-500 text-xs">No recorded legislative amendments.</div>
                  )}
                </div>
              )}

              {activeTab === 'judgments' && (
                <div className="space-y-3 text-xs">
                  <div
                    onClick={() => {
                      setSelectedCaseId('case-rajesh-shah');
                      setCurrentView('judgment_detail');
                    }}
                    className="p-3.5 bg-slate-50 rounded-2xs border border-slate-200 hover:border-[#0b2239] cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#0b2239]">
                        State of Maharashtra v. Rajesh Shah
                      </div>
                      <span className="gov-stamp gov-stamp-gold text-[9px]">
                        (2020) 5 SCC 123
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">
                      Held: Dishonest intention at the inception is mandatory under Section 420. Mere breach does not establish criminal fraud.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
