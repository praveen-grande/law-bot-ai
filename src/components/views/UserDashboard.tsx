import React from 'react';
import {
  MessageSquare,
  Search,
  BookOpen,
  Scale,
  FileText,
  Compass,
  GitCompare,
  Bookmark,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle,
  FileCheck,
  Landmark,
  ShieldCheck,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/translations';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    setSearchQuery,
    setSelectedSectionId,
    setSelectedCaseId,
    conversations,
    setActiveConversationId,
    savedSections,
    savedCases,
    uploadedDocs,
    language
  } = useApp();

  const t = getTranslation(language).dashboard;
  const tSide = getTranslation(language).sidebar;

  const handleOpenChat = (convId: string) => {
    setActiveConversationId(convId);
    setCurrentView('ask_law_bot');
  };

  const handleQuickSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentView('legal_search');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Official Government Desk Banner */}
      <div className="bg-[#0b2239] rounded-sm p-6 sm:p-7 text-white shadow-sm border-l-4 border-amber-500 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[#123253]/30 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-2xs bg-[#123253] text-amber-300 text-xs font-semibold mb-2 border border-[#1a426e]">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.workspaceTag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
              {t.welcomeBack}, {currentUser?.name || 'Citizen'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {t.welcomeSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setCurrentView('ask_law_bot')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xs text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-slate-950" />
              <span>{t.askLawBotBtn}</span>
            </button>
            <button
              onClick={() => setCurrentView('document_analysis')}
              className="px-3.5 py-2 bg-[#123253] hover:bg-[#1a426e] text-white font-semibold rounded-xs text-xs sm:text-sm border border-[#1a426e] transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>{t.uploadDocBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Official Quick Research Services Grid (8 Services) */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-300 pb-1.5">
          <h2 className="text-xs font-bold text-[#0b2239] uppercase tracking-wider font-serif">
            {t.quickToolsTitle}
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">India Code & NJDG Aligned</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div
            onClick={() => setCurrentView('ask_law_bot')}
            className="bg-white p-4 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0b2239] font-serif">{tSide.askLawBot}</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Conversational legal assistance</p>
          </div>

          <div
            onClick={() => setCurrentView('legal_search')}
            className="bg-white p-4 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0b2239] font-serif">{tSide.legalSearch}</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Acts, judgments & gazettes</p>
          </div>

          <div
            onClick={() => {
              setSelectedSectionId('sec-ipc-420');
              setCurrentView('acts_sections');
            }}
            className="bg-white p-4 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0b2239] font-serif">{tSide.actsSections}</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Statutes & simplified sections</p>
          </div>

          <div
            onClick={() => {
              setSelectedCaseId('case-rajesh-shah');
              setCurrentView('case_law');
            }}
            className="bg-white p-4 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0b2239] font-serif">{tSide.caseLawExplorer}</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Supreme Court & High Court cases</p>
          </div>

          <div
            onClick={() => setCurrentView('document_analysis')}
            className="bg-white p-4 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0b2239] font-serif">{tSide.docAnalysis}</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Agreements & clause check</p>
          </div>

          <div
            onClick={() => setCurrentView('legal_topics')}
            className="bg-white p-4 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0b2239] font-serif">{tSide.legalTopics}</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Civil, criminal & cyber law</p>
          </div>

          <div
            onClick={() => setCurrentView('comparison_tool')}
            className="bg-white p-4 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-3">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0b2239] font-serif">{tSide.lawComparison}</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Compare sections side-by-side</p>
          </div>

          <div
            onClick={() => setCurrentView('my_research')}
            className="bg-white p-4 rounded-sm border border-slate-300 hover:border-[#0b2239] hover:shadow-xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-3">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0b2239] font-serif">{tSide.myResearch}</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Saved acts, cases & notes</p>
          </div>
        </div>
      </div>

      {/* 3. Research Workspace Stats & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved Research Inventory */}
        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-bold text-xs text-[#0b2239] uppercase tracking-wider font-serif">
              {t.savedDossier}
            </h3>
            <button
              onClick={() => setCurrentView('my_research')}
              className="text-xs text-[#0b2239] hover:underline font-bold"
            >
              {t.viewAll}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="bg-slate-50 p-3 rounded-2xs border border-slate-200 text-center">
              <div className="text-xl font-bold text-[#0b2239] font-serif">
                {savedSections.length}
              </div>
              <div className="text-[10px] text-slate-600 uppercase font-semibold mt-0.5">
                {t.savedSections}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xs border border-slate-200 text-center">
              <div className="text-xl font-bold text-[#0b2239] font-serif">
                {savedCases.length}
              </div>
              <div className="text-[10px] text-slate-600 uppercase font-semibold mt-0.5">
                {t.savedJudgments}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xs border border-slate-200 text-center">
              <div className="text-xl font-bold text-[#0b2239] font-serif">
                {uploadedDocs.length}
              </div>
              <div className="text-[10px] text-slate-600 uppercase font-semibold mt-0.5">
                {t.savedDocuments}
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4 text-xs">
            <div className="p-2.5 rounded-2xs bg-slate-50 border border-slate-200">
              <div className="font-bold text-[#0b2239] flex items-center justify-between">
                <span>IPC Section 420</span>
                <span className="gov-stamp gov-stamp-central text-[9px]">Indian Penal Code</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Cheating and dishonestly inducing delivery of property.
              </p>
            </div>

            <div className="p-2.5 rounded-2xs bg-slate-50 border border-slate-200">
              <div className="font-bold text-[#0b2239] flex items-center justify-between">
                <span>State of Maharashtra v. Rajesh Shah</span>
                <span className="gov-stamp gov-stamp-gold text-[9px]">(2020) 5 SCC 123</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Essential ingredients of cheating under IPC 420.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Research Inquiries & Activity */}
        <div className="lg:col-span-2 bg-white p-5 rounded-sm border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-bold text-xs text-[#0b2239] uppercase tracking-wider font-serif">
              {t.recentQueriesTitle}
            </h3>
            <button
              onClick={() => setCurrentView('chat_history')}
              className="text-xs text-[#0b2239] hover:underline font-bold"
            >
              {t.historyBtn}
            </button>
          </div>

          <div className="divide-y divide-slate-200 mt-2">
            {conversations.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => handleOpenChat(c.id)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-2xs bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4 text-[#0b2239]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#0b2239]">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {c.messages[c.messages.length - 1]?.content || 'Legal consultation session'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {c.date}
                  </span>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="gov-stamp gov-stamp-central text-[8px]">
                      {(c.messages[0]?.language || 'EN').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
