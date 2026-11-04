import React, { useState } from 'react';
import {
  Search,
  Scale,
  Calendar,
  Building,
  Bookmark,
  ArrowRight,
  ExternalLink,
  Tag,
  Filter,
  Landmark,
  Gavel
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/translations';

export const CaseLawExplorer: React.FC = () => {
  const {
    judgments,
    setSelectedCaseId,
    setCurrentView,
    savedCases,
    toggleBookmarkCase,
    language
  } = useApp();

  const t = getTranslation(language).cases;
  const [searchWord, setSearchWord] = useState('');
  const [courtFilter, setCourtFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');

  const filteredJudgments = judgments.filter((j) => {
    const q = searchWord.toLowerCase().trim();
    if (courtFilter !== 'All' && !j.court.includes(courtFilter)) return false;
    if (topicFilter !== 'All' && !j.topics.includes(topicFilter)) return false;
    if (!q) return true;
    return (
      j.caseTitle.toLowerCase().includes(q) ||
      j.citation.toLowerCase().includes(q) ||
      j.aiSummary.toLowerCase().includes(q) ||
      j.topics.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setCurrentView('judgment_detail');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* Official Government Search Header */}
      <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0b2239]">
              {t.title}
            </h1>
            <span className="gov-stamp gov-stamp-gold text-[10px]">
              e-SCR & NJDG
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-4 py-2 text-xs sm:text-sm bg-slate-50 rounded-2xs border border-slate-300 focus:bg-white focus:border-[#0b2239] focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            className="px-6 py-2 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-2xs text-xs tracking-wide uppercase transition-colors shrink-0 border border-[#071727]"
          >
            {t.searchBtn}
          </button>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-bold uppercase text-[10px]">{t.courtLabel}</span>
            <select
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-2xs px-2.5 py-1 text-slate-800 font-medium focus:outline-hidden text-xs"
            >
              <option value="All">{t.allCourts}</option>
              <option value="Supreme Court">Supreme Court of India</option>
              <option value="High Court">High Courts</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-bold uppercase text-[10px]">{t.topicLabel}</span>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-2xs px-2.5 py-1 text-slate-800 font-medium focus:outline-hidden text-xs"
            >
              <option value="All">{t.allTopics}</option>
              <option value="Criminal Law">Criminal Law</option>
              <option value="Property Law">Property Law</option>
              <option value="Constitutional Law">Constitutional Law</option>
              <option value="Cyber Law">Cyber Law</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span className="font-bold text-[#0b2239] font-serif">
          {filteredJudgments.length} {t.resultsFound}
        </span>
        <span className="text-slate-500 font-medium">Order: Most Authoritative / Recency</span>
      </div>

      {/* Case List */}
      <div className="space-y-3">
        {filteredJudgments.map((caseItem) => {
          const isSaved = savedCases.includes(caseItem.id);
          return (
            <div
              key={caseItem.id}
              className="bg-white p-5 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-xs transition-all space-y-3 text-xs"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    onClick={() => handleSelectCase(caseItem.id)}
                    className="font-bold text-base sm:text-lg text-[#0b2239] hover:text-amber-800 cursor-pointer font-serif transition-colors"
                  >
                    {caseItem.caseTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-slate-600 text-xs">
                    <span className="font-bold text-[#0b2239]">{caseItem.court}</span>
                    <span>·</span>
                    <span className="font-mono text-amber-900 font-bold">{caseItem.citation}</span>
                    <span>·</span>
                    <span className="font-mono text-slate-500">{caseItem.decisionDate}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleBookmarkCase(caseItem.id)}
                  className={`p-1.5 rounded-2xs border transition-colors ${
                    isSaved
                      ? 'bg-amber-50 text-amber-900 border-amber-400'
                      : 'bg-white text-slate-500 border-slate-300 hover:text-slate-900'
                  }`}
                  title="Bookmark judgment"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                </button>
              </div>

              <p className="text-slate-700 leading-relaxed font-sans line-clamp-3">
                {caseItem.aiSummary}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="flex flex-wrap gap-1.5">
                  {caseItem.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="gov-stamp gov-stamp-central text-[10px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectCase(caseItem.id)}
                  className="px-3 py-1.5 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-2xs text-xs flex items-center gap-1.5 transition-colors border border-[#071727]"
                >
                  <span>निर्णय का संपूर्ण पाठ (Read Full Judgment)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
