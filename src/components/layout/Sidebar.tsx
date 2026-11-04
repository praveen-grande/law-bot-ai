import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Search,
  BookOpen,
  Scale,
  FileText,
  Compass,
  GitCompare,
  Bookmark,
  History,
  Settings,
  HelpCircle,
  Shield,
  ShieldCheck,
  Users,
  Database,
  Activity,
  ChevronRight,
  Gavel,
  Landmark,
  FileSpreadsheet
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';
import { getTranslation } from '../../utils/translations';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    createNewChat,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    language
  } = useApp();

  const t = getTranslation(language).sidebar;

  const isViewActive = (view: AppView) => currentView === view;

  const navigateView = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-[#071727]/70 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`${
          isMobileMenuOpen
            ? 'fixed inset-y-0 left-0 z-50 flex shadow-2xl animate-in slide-in-from-left duration-200'
            : 'hidden md:flex'
        } w-64 bg-[#0b2239] text-slate-200 flex-col shrink-0 min-h-[calc(100vh-80px)] border-r border-[#1a426e] text-xs select-none`}
      >
        {/* Ask Law Bot quick action button in clean government style */}
        <div className="p-3 border-b border-[#1a426e] bg-[#071727]/50">
          <button
            onClick={() => {
              createNewChat();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-xs shadow-xs transition-colors text-xs border border-amber-400"
          >
            <MessageSquare className="w-4 h-4 text-slate-950" />
            <span>{t.newQuery}</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* Citizen & Legal Research Services */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-amber-400/90 flex items-center gap-1.5 border-b border-[#1a426e]/60 mb-1">
              <Landmark className="w-3 h-3 text-amber-400" />
              <span>{t.sectionCitizen}</span>
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => navigateView('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('dashboard')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-300" />
                <span>{t.dashboard}</span>
              </button>

              <button
                onClick={() => navigateView('ask_law_bot')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('ask_law_bot')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>{t.askLawBot}</span>
              </button>

              <button
                onClick={() => navigateView('legal_search')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('legal_search')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4 text-sky-400" />
                <span>{t.legalSearch}</span>
              </button>
            </nav>
          </div>

          {/* Statutory & Judicial Repository */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-amber-400/90 flex items-center gap-1.5 border-b border-[#1a426e]/60 mb-1">
              <Gavel className="w-3 h-3 text-amber-400" />
              <span>{t.sectionStatutes}</span>
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => navigateView('acts_sections')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('acts_sections')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{t.actsSections}</span>
              </button>

              <button
                onClick={() => navigateView('case_law')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('case_law') || isViewActive('judgment_detail')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Scale className="w-4 h-4 text-purple-400" />
                <span>{t.caseLawExplorer}</span>
              </button>

              <button
                onClick={() => navigateView('document_analysis')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('document_analysis')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-yellow-400" />
                <span>{t.docAnalysis}</span>
              </button>

              <button
                onClick={() => navigateView('legal_topics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('legal_topics')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>{t.legalTopics}</span>
              </button>

              <button
                onClick={() => navigateView('comparison_tool')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('comparison_tool')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <GitCompare className="w-4 h-4 text-teal-400" />
                <span>{t.lawComparison}</span>
              </button>

              <button
                onClick={() => navigateView('my_research')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('my_research')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4 text-rose-400" />
                <span>{t.myResearch}</span>
              </button>

              <button
                onClick={() => setCurrentView('chat_history')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('chat_history')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <History className="w-4 h-4 text-orange-400" />
                <span>{t.chatHistory}</span>
              </button>

              <button
                onClick={() => setCurrentView('feedback_support')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                  isViewActive('feedback_support')
                    ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>{t.helpSupport}</span>
              </button>
            </nav>
          </div>

          {/* Admin Management Section */}
          {(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-amber-400/90 flex items-center justify-between border-b border-[#1a426e]/60 mb-1">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-sky-400" />
                  {t.sectionAdmin}
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded-2xs bg-[#123253] text-sky-300">
                  Gov
                </span>
              </div>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setCurrentView('admin_dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                    isViewActive('admin_dashboard')
                      ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-400" />
                  <span>{t.adminDesk}</span>
                </button>

                <button
                  onClick={() => setCurrentView('user_management')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                    isViewActive('user_management')
                      ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>{t.usersRegistry}</span>
                </button>

                <button
                  onClick={() => navigateView('legal_sources')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                    isViewActive('legal_sources')
                      ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>{t.sourceSyncRegistry}</span>
                </button>

                <button
                  onClick={() => navigateView('dataset_management')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                    isViewActive('dataset_management')
                      ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <span>{t.legalDatasets}</span>
                </button>

                <button
                  onClick={() => navigateView('system_health')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                    isViewActive('system_health')
                      ? 'bg-white/15 text-white font-bold border-l-3 border-amber-400 shadow-2xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>{t.systemHealth}</span>
                </button>
              </nav>
            </div>
          )}

          {/* Super Admin Apex Controller Section */}
          {currentUser?.role === 'superadmin' && (
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-amber-400 flex items-center justify-between border-b border-[#1a426e]/60 mb-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  {t.sectionSuperAdmin}
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded-2xs bg-amber-500/20 text-amber-300">
                  Apex
                </span>
              </div>
              <nav className="space-y-0.5">
                <button
                  onClick={() => navigateView('superadmin_dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors ${
                    isViewActive('superadmin_dashboard')
                      ? 'bg-amber-500/25 text-amber-200 font-bold border-l-3 border-amber-400 shadow-2xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{t.superAdminConsole}</span>
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Official Footer Disclaimer */}
        <div className="p-3 border-t border-[#1a426e] bg-[#071727] text-[10px] text-slate-300">
          <div className="flex items-center justify-between font-bold text-amber-300 mb-0.5">
            <span>{t.jurisdictionFooter}</span>
            <span className="font-mono text-emerald-400">v2.4</span>
          </div>
          <p className="line-clamp-2 text-slate-400 text-[9px] leading-tight">
            {t.footerVerified}
          </p>
        </div>
      </aside>
    </>
  );
};
