import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Building,
  Scale,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Tag,
  CheckCircle2,
  ChevronDown,
  Landmark,
  Gavel
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/translations';

export const LegalSearch: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    sections,
    judgments,
    setSelectedSectionId,
    setSelectedCaseId,
    setCurrentView,
    language
  } = useApp();

  const t = getTranslation(language).search;

  const [activeTab, setActiveTab] = useState<'All' | 'Acts & Rules' | 'Judgments' | 'Notifications'>('All');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<'All' | 'Central' | 'State'>('All');
  const [courtFilter, setCourtFilter] = useState<'All' | 'Supreme Court' | 'High Court'>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');

  // Filter logic
  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // Map statutory sections to unified search item
    const secItems = sections.map((s) => ({
      id: s.id,
      type: 'Act' as const,
      subType: s.actName,
      title: `${s.actName} — Section ${s.sectionNumber}: ${s.title}`,
      shortTitle: `${s.actName} - Sec ${s.sectionNumber}`,
      jurisdiction: s.jurisdiction,
      authority: 'Ministry of Law and Justice (India Code)',
      date: `${s.actYear}`,
      snippet: s.statutoryText,
      explanation: s.simpleExplanation,
      tags: [`Section ${s.sectionNumber}`, ...(s.relatedSections.map((r: string) => `Sec ${r}`))],
      raw: s
    }));

    // Map judgments to unified search item
    const judgeItems = judgments.map((j) => ({
      id: j.id,
      type: 'Judgment' as const,
      subType: j.court,
      title: `${j.caseTitle} — ${j.citation}`,
      shortTitle: j.caseTitle,
      jurisdiction: j.jurisdiction,
      authority: j.court,
      date: j.decisionDate,
      snippet: j.judgmentSnippet,
      explanation: j.aiSummary,
      tags: j.topics,
      raw: j
    }));

    let allItems = [...secItems, ...judgeItems];

    // Filter by type tab
    if (activeTab === 'Acts & Rules') {
      allItems = allItems.filter((i) => i.type === 'Act');
    } else if (activeTab === 'Judgments') {
      allItems = allItems.filter((i) => i.type === 'Judgment');
    }

    // Filter by jurisdiction
    if (jurisdictionFilter !== 'All') {
      allItems = allItems.filter((i) => i.jurisdiction.toLowerCase().includes(jurisdictionFilter.toLowerCase()));
    }

    // Filter by court
    if (courtFilter !== 'All') {
      allItems = allItems.filter((i) => i.authority.toLowerCase().includes(courtFilter.toLowerCase()));
    }

    // Query match
    if (q) {
      allItems = allItems.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.snippet.toLowerCase().includes(q) ||
          i.explanation.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return allItems;
  }, [searchQuery, sections, judgments, activeTab, jurisdictionFilter, courtFilter]);

  const handleResultClick = (item: any) => {
    if (item.type === 'Act') {
      setSelectedSectionId(item.id);
      setCurrentView('acts_sections');
    } else {
      setSelectedCaseId(item.id);
      setCurrentView('judgment_detail');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* Official Government Search Bar */}
      <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0b2239]">
              {t.title}
            </h1>
            <span className="gov-stamp gov-stamp-central text-[10px]">
              India Code & NJDG Indexed
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {t.subtitle}
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-4 py-2 text-xs sm:text-sm bg-slate-50 rounded-2xs border border-slate-300 focus:bg-white focus:border-[#0b2239] focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-2xs text-xs tracking-wide uppercase transition-colors shrink-0 border border-[#071727]"
          >
            {t.searchBtn}
          </button>
        </form>

        {/* Filter Tabs in Official Government Style */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-200 overflow-x-auto text-xs">
          {(['All', 'Acts & Rules', 'Judgments', 'Notifications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-2xs font-bold transition-all shrink-0 text-xs ${
                activeTab === tab
                  ? 'bg-[#0b2239] text-amber-300 shadow-2xs border border-[#071727]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Filters & Right Results */}
      <div className="grid lg:grid-cols-4 gap-6 items-start">
        {/* Left Faceted Filter Sidebar */}
        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs space-y-6 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-bold text-[#0b2239] flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-serif">
              <Filter className="w-3.5 h-3.5 text-amber-700" />
              <span>फ़िल्टर (Filter Records)</span>
            </h3>
            {(jurisdictionFilter !== 'All' || courtFilter !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setJurisdictionFilter('All');
                  setCourtFilter('All');
                  setSearchQuery('');
                }}
                className="text-[11px] text-[#0b2239] hover:underline font-bold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Jurisdiction Filter */}
          <div>
            <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wide mb-2">
              अधिकार क्षेत्र (Jurisdiction)
            </h4>
            <div className="space-y-1.5">
              <label className="flex items-center justify-between cursor-pointer text-slate-700 hover:text-slate-900">
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="jurisdiction"
                    checked={jurisdictionFilter === 'All'}
                    onChange={() => setJurisdictionFilter('All')}
                    className="text-[#0b2239]"
                  />
                  <span>All Jurisdictions</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">2,101</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-700 hover:text-slate-900">
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="jurisdiction"
                    checked={jurisdictionFilter === 'Central'}
                    onChange={() => setJurisdictionFilter('Central')}
                    className="text-[#0b2239]"
                  />
                  <span>Central (Union Acts)</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">1,245</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-700 hover:text-slate-900">
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="jurisdiction"
                    checked={jurisdictionFilter === 'State'}
                    onChange={() => setJurisdictionFilter('State')}
                    className="text-[#0b2239]"
                  />
                  <span>State Laws</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">856</span>
              </label>
            </div>
          </div>

          {/* Court Filter */}
          <div>
            <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wide mb-2">
              न्यायिक प्राधिकरण (Court Authority)
            </h4>
            <div className="space-y-1.5">
              <label className="flex items-center justify-between cursor-pointer text-slate-700 hover:text-slate-900">
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="court"
                    checked={courtFilter === 'All'}
                    onChange={() => setCourtFilter('All')}
                    className="text-[#0b2239]"
                  />
                  <span>All Courts</span>
                </span>
              </label>
              <label className="flex items-center justify-between cursor-pointer text-slate-700 hover:text-slate-900">
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="court"
                    checked={courtFilter === 'Supreme Court'}
                    onChange={() => setCourtFilter('Supreme Court')}
                    className="text-[#0b2239]"
                  />
                  <span>Supreme Court of India</span>
                </span>
              </label>
              <label className="flex items-center justify-between cursor-pointer text-slate-700 hover:text-slate-900">
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="court"
                    checked={courtFilter === 'High Court'}
                    onChange={() => setCourtFilter('High Court')}
                    className="text-[#0b2239]"
                  />
                  <span>High Courts</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Search Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-bold text-[#0b2239] font-serif">
              {filteredResults.length} official records found
            </span>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-2xs px-2.5 py-1 text-slate-800 font-bold focus:outline-hidden text-xs"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date (Newest)</option>
              </select>
            </div>
          </div>

          {/* Results List Cards */}
          <div className="space-y-3">
            {filteredResults.length === 0 ? (
              <div className="bg-white rounded-sm p-12 text-center border border-slate-300 text-slate-500 space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-400" />
                <p className="font-bold text-[#0b2239] font-serif">No legal records match your search criteria.</p>
                <p className="text-xs">
                  Try checking the Act spelling (e.g., Indian Penal Code, Registration Act), or clear active filters.
                </p>
              </div>
            ) : (
              filteredResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleResultClick(item)}
                  className="bg-white p-5 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-xs transition-all cursor-pointer space-y-2 text-xs group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`gov-stamp ${
                          item.type === 'Act'
                            ? 'gov-stamp-central'
                            : 'gov-stamp-gold'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        · {item.jurisdiction}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono shrink-0">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-[#0b2239] group-hover:text-amber-800 transition-colors font-serif">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    {item.snippet}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-2xs text-[10px] font-medium border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-[#0b2239] font-bold text-xs group-hover:translate-x-1 transition-transform">
                      <span>अभिलेख देखें (Inspect Official Record)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
