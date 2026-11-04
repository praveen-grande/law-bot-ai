import React, { useState } from 'react';
import {
  Scale,
  Search,
  BookOpen,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Globe,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Lock,
  Layers,
  HelpCircle,
  Landmark,
  Building2,
  Gavel,
  FileCheck2,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../types/legal';
import { getTranslation } from '../../utils/translations';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setSearchQuery, language, setLanguage } = useApp();
  const [localQuery, setLocalQuery] = useState('');

  const t = getTranslation(language).landing;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery);
      setCurrentView('ask_law_bot');
    } else {
      setCurrentView('ask_law_bot');
    }
  };

  const handleSampleQuery = (q: string) => {
    setLocalQuery(q);
    setSearchQuery(q);
    setCurrentView('ask_law_bot');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col text-slate-800">
      {/* 1. Official Government Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-[#071727] text-white border-b-4 border-amber-600">
        {/* Subtle geometric government backdrop pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1a426e_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Official Emblem Banner Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#0b2239] border border-[#1a426e] text-slate-200 text-xs font-semibold mb-6 shadow-sm">
            <span className="font-serif text-amber-400 font-bold">{t.emblemMinistry}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-300 font-mono text-[11px]">BNS · BNSS · BSA Ready</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif text-white max-w-4xl mx-auto leading-tight">
            {t.heroTitle}
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Prominent Legal Search Bar in Official Government Style */}
          <div className="mt-8 sm:mt-10 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 rounded-sm shadow-xl border-2 border-[#0b2239] flex flex-col sm:flex-row gap-2 items-center text-slate-900"
            >
              <div className="flex items-center flex-1 w-full pl-3 pr-2">
                <Search className="w-5 h-5 text-[#0b2239] shrink-0" />
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder={t.searchPlaceholderLanding}
                  className="w-full px-3 py-2 text-sm bg-transparent border-none focus:outline-hidden text-slate-900 placeholder:text-slate-500 font-sans"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end px-2 sm:px-0">
                {/* Language Switch */}
                <div className="flex bg-slate-100 p-0.5 rounded-sm border border-slate-300 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 rounded-2xs transition-all ${
                      language === 'en'
                        ? 'bg-[#0b2239] text-amber-300 shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hi')}
                    className={`px-2 py-1 rounded-2xs transition-all ${
                      language === 'hi'
                        ? 'bg-[#0b2239] text-amber-300 shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('te')}
                    className={`px-2 py-1 rounded-2xs transition-all ${
                      language === 'te'
                        ? 'bg-[#0b2239] text-amber-300 shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    తెలుగు
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-sm border border-[#071727] transition-all flex items-center gap-1.5 shrink-0 text-xs tracking-wide uppercase"
                >
                  <span>{t.searchBtn}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </form>

            {/* Popular Official Query Topics */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400 font-semibold">{t.popularLabel}</span>
              <button
                onClick={() => handleSampleQuery('Explain IPC Section 420 in simple language')}
                className="px-2.5 py-0.5 rounded-xs bg-[#0b2239] hover:bg-[#123253] text-amber-300 border border-[#1a426e] transition-colors text-[11px]"
              >
                IPC Sec 420 Cheating
              </button>
              <button
                onClick={() => handleSampleQuery('Registration Act 1908 Section 17 compulsory registration')}
                className="px-2.5 py-0.5 rounded-xs bg-[#0b2239] hover:bg-[#123253] text-slate-200 border border-[#1a426e] transition-colors text-[11px]"
              >
                Registration Act Sec 17
              </button>
              <button
                onClick={() => handleSampleQuery('State of Maharashtra v. Rajesh Shah')}
                className="px-2.5 py-0.5 rounded-xs bg-[#0b2239] hover:bg-[#123253] text-slate-200 border border-[#1a426e] transition-colors text-[11px]"
              >
                Rajesh Shah (2020) Precedent
              </button>
              <button
                onClick={() => handleSampleQuery('Procedure to file consumer protection complaint under CPA 2019')}
                className="px-2.5 py-0.5 rounded-xs bg-[#0b2239] hover:bg-[#123253] text-slate-200 border border-[#1a426e] transition-colors text-[11px]"
              >
                Consumer Protection 2019
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Official Statutory Metrics Ribbon */}
      <section className="bg-white border-b border-slate-300 py-6 px-4 sm:px-6 shadow-2xs">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r last:border-none border-slate-200 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0b2239] font-serif">
              25,000+
            </div>
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1">
              {t.statActs}
            </div>
            <div className="text-[10px] text-slate-400">India Code & State Gazettes</div>
          </div>

          <div className="border-r last:border-none border-slate-200 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0b2239] font-serif">
              1,00,000+
            </div>
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1">
              {t.statJudgments}
            </div>
            <div className="text-[10px] text-slate-400">Supreme Court & High Courts</div>
          </div>

          <div className="border-r last:border-none border-slate-200 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-serif">
              3
            </div>
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1">
              {t.statLanguages}
            </div>
            <div className="text-[10px] text-slate-400">English, हिन्दी & తెలుగు</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-serif">
              100%
            </div>
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1">
              {t.statGrounding}
            </div>
            <div className="text-[10px] text-slate-400">NIC / GIGW 3.0 Aligned</div>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars (4 Key Portals) */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0b2239]">
            {t.pillarsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            {t.pillarsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1 */}
          <div
            onClick={() => setCurrentView('acts_sections')}
            className="bg-white p-5 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#0b2239] font-serif group-hover:text-amber-800 transition-colors">
              {t.pillarActs}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {t.pillarActsDesc}
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#0b2239]">
              <span>{t.viewActs}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => setCurrentView('case_law')}
            className="bg-white p-5 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#0b2239] font-serif group-hover:text-amber-800 transition-colors">
              {t.pillarCase}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {t.pillarCaseDesc}
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#0b2239]">
              <span>{t.viewJudgments}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => setCurrentView('ask_law_bot')}
            className="bg-white p-5 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-sm text-[#0b2239] font-serif group-hover:text-amber-800 transition-colors">
              {t.pillarAI}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {t.pillarAIDesc}
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#0b2239]">
              <span>{t.viewConsultation}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 4 */}
          <div
            onClick={() => setCurrentView('document_analysis')}
            className="bg-white p-5 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#0b2239] font-serif group-hover:text-amber-800 transition-colors">
              {t.pillarDoc}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {t.pillarDocDesc}
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#0b2239]">
              <span>{t.viewDoc}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Official Repositories & Verification Banner */}
      <section className="bg-slate-200/80 border-t border-b border-slate-300 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold text-[#0b2239] uppercase tracking-wider font-serif">
              {t.sourceReposTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-sm border border-slate-300 text-center">
              <div className="text-xs font-bold text-[#0b2239] font-serif">India Code Portal</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Ministry of Law & Justice</div>
              <span className="gov-stamp gov-stamp-active mt-2 text-[9px]">24h Automated Sync</span>
            </div>

            <div className="bg-white p-4 rounded-sm border border-slate-300 text-center">
              <div className="text-xs font-bold text-[#0b2239] font-serif">Supreme Court of India</div>
              <div className="text-[10px] text-slate-500 mt-0.5">e-SCR Digital Records</div>
              <span className="gov-stamp gov-stamp-active mt-2 text-[9px]">Verified Precedents</span>
            </div>

            <div className="bg-white p-4 rounded-sm border border-slate-300 text-center">
              <div className="text-xs font-bold text-[#0b2239] font-serif">The Gazette of India</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Extraordinary Notifications</div>
              <span className="gov-stamp gov-stamp-gold mt-2 text-[9px]">Official Gazettes</span>
            </div>

            <div className="bg-white p-4 rounded-sm border border-slate-300 text-center">
              <div className="text-xs font-bold text-[#0b2239] font-serif">National Judicial Grid</div>
              <div className="text-[10px] text-slate-500 mt-0.5">High Courts of India</div>
              <span className="gov-stamp gov-stamp-active mt-2 text-[9px]">NJDG Interlinked</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Official Government Footer */}
      <footer className="mt-auto bg-[#071727] text-slate-300 text-xs border-t-2 border-amber-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <span className="text-base font-bold text-white font-serif uppercase tracking-tight">
                  {t.emblemMinistry}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                Law Bot AI is an official digital initiative under the Department of Justice, Ministry of Law and Justice, Government of India, designed to promote citizen access to justice and simplify statutory research.
              </p>
              <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
                <span className="text-amber-400 font-serif">सत्यमेव जयते</span>
                <span>·</span>
                <span>GIGW 3.0 Guidelines Compliant</span>
                <span>·</span>
                <span>e-Courts Interoperable</span>
              </div>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3 font-serif">
                Quick Navigation
              </div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => setCurrentView('acts_sections')} className="hover:text-amber-300">
                    Acts & Sections
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('case_law')} className="hover:text-amber-300">
                    Supreme Court Judgments
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('legal_search')} className="hover:text-amber-300">
                    Statutory Search
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('document_analysis')} className="hover:text-amber-300">
                    Contract Review
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3 font-serif">
                Access Portals
              </div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => setCurrentView('auth')} className="hover:text-amber-300">
                    Citizen SSO Login (Google)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('auth')} className="hover:text-amber-300">
                    Department Administrator Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('feedback_support')} className="hover:text-amber-300">
                    Public Grievance & Helpdesk
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#123253] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
            <div>
              © 2026 Ministry of Law & Justice, Government of India. All rights reserved.
            </div>
            <div className="mt-2 sm:mt-0 flex gap-4 text-slate-400">
              <span className="hover:text-white cursor-pointer">Disclaimer & Terms</span>
              <span>·</span>
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span>·</span>
              <span className="hover:text-white cursor-pointer">Accessibility Statement</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
