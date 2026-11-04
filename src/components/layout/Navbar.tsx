import React, { useState } from 'react';
import {
  Scale,
  Search,
  Globe,
  Bell,
  User,
  Shield,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
  Menu,
  X,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../types/legal';
import { getTranslation } from '../../utils/translations';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    switchRole,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    showToast,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const t = getTranslation(language).nav;

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('legal_search');
    }
  };

  const handleLangChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    showToast(
      lang === 'en'
        ? 'Language switched to English'
        : lang === 'te'
        ? 'భాష మార్చబడింది: తెలుగు'
        : 'भाषा चुनी गई: हिन्दी'
    );
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-300 shadow-xs">
      {/* 1. Official Government Masthead Micro-Bar */}
      <div className="bg-[#071727] text-slate-200 text-[11px] px-3 sm:px-6 py-1 border-b border-[#123253]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Official Emblem & Ministry Header */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400 font-serif">{t.govIndia}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-200">{t.ministry}</span>
          </div>

          {/* Accessibility & Government Standards */}
          <div className="flex items-center gap-3 text-[10px]">
            <span className="hidden lg:inline text-emerald-400 font-mono tracking-tight font-semibold">
              ● {t.verifiedStamp}
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            {/* Font Sizing Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-[#123253] px-1.5 py-0.5 rounded-xs text-slate-300">
              <span className="text-slate-400 text-[9px] mr-1">{t.fontLabel}</span>
              <button
                onClick={() => setFontSize('sm')}
                className={`px-1 hover:text-white ${fontSize === 'sm' ? 'text-amber-300 font-bold' : ''}`}
                title="Small Font"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-1 hover:text-white ${fontSize === 'md' ? 'text-amber-300 font-bold' : ''}`}
                title="Normal Font"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-1 hover:text-white ${fontSize === 'lg' ? 'text-amber-300 font-bold' : ''}`}
                title="Large Font"
              >
                A+
              </button>
            </div>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-amber-300/90 font-medium">{t.motto}</span>
          </div>
        </div>
      </div>

      {/* Official Tricolor Hairline Ribbon */}
      <div className="gov-tricolor-stripe" />

      {/* 2. Main Official Header Bar */}
      <header className="px-3 sm:px-6 py-2.5 bg-gradient-to-r from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {currentView !== 'landing' && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 rounded-sm border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                title="Toggle Portal Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {/* Official Portal Crest & Identity */}
            <div
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
              title="Return to National Legal Portal Home"
            >
              {/* National Scales of Justice Emblem */}
              <div className="relative w-10 h-10 rounded-sm bg-[#0b2239] border border-[#1a426e] flex items-center justify-center shadow-xs">
                <div className="absolute inset-0.5 border border-amber-500/40 rounded-2xs pointer-events-none" />
                <Scale className="w-5 h-5 text-amber-400" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0b2239] font-serif uppercase">
                    Law Bot AI
                  </span>
                  <span className="gov-stamp gov-stamp-central text-[9px] bg-slate-100 border-[#0b2239]">
                    Gov of India
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 font-medium tracking-tight -mt-0.5">
                  {t.portalSubtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Global Judicial Search */}
          {currentView !== 'landing' && (
            <form
              onSubmit={handleGlobalSearch}
              className="flex-1 max-w-xl mx-2 hidden md:block"
            >
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9 pr-24 py-1.5 text-xs bg-white text-slate-900 rounded-sm border border-slate-400 focus:border-[#0b2239] focus:ring-1 focus:ring-[#0b2239] focus:outline-hidden transition-all placeholder:text-slate-500 shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1 text-xs font-bold bg-[#0b2239] hover:bg-[#123253] text-amber-300 rounded-xs border border-[#071727] transition-colors"
                >
                  {t.searchBtn}
                </button>
              </div>
            </form>
          )}

          {/* Right Controls: Single-Language Switcher, Role Selector, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-200/90 p-0.5 rounded-sm border border-slate-300 text-xs font-medium">
              <button
                onClick={() => handleLangChange('en')}
                className={`px-2 py-0.5 rounded-2xs transition-all ${
                  language === 'en'
                    ? 'bg-[#0b2239] text-amber-300 font-bold shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLangChange('hi')}
                className={`px-2 py-0.5 rounded-2xs transition-all ${
                  language === 'hi'
                    ? 'bg-[#0b2239] text-amber-300 font-bold shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="हिन्दी विधिक पोर्टल"
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLangChange('te')}
                className={`px-2 py-0.5 rounded-2xs transition-all ${
                  language === 'te'
                    ? 'bg-[#0b2239] text-amber-300 font-bold shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="తెలుగు చట్టపరమైన పోర్టల్"
              >
                తెలుగు
              </button>
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-sm border border-slate-300 bg-white hover:bg-slate-50 text-[#0b2239] shadow-2xs transition-colors"
                title="Switch portal access role"
              >
                {currentUser?.role === 'superadmin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                ) : currentUser?.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5 text-[#0b2239]" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-700" />
                )}
                <span className="hidden sm:inline capitalize text-[11px]">
                  {currentUser?.role === 'superadmin'
                    ? t.roleSuperAdmin
                    : currentUser?.role === 'admin'
                    ? t.roleAdmin
                    : t.roleCitizen}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-sm shadow-xl border border-slate-300 py-1.5 z-50 text-xs animate-in fade-in">
                  <div className="px-3 py-1 font-bold text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                    {t.selectRole}
                  </div>
                  <button
                    onClick={() => {
                      switchRole('user');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 ${
                      (currentUser?.role || 'user') === 'user' ? 'bg-amber-50/80 text-[#0b2239] font-bold border-l-2 border-amber-600' : 'text-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4 text-slate-600" />
                    <div>
                      <div className="font-semibold">{t.roleCitizen}</div>
                      <div className="text-[10px] text-slate-500">{t.citizenDesc}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setShowRoleMenu(false);
                      setCurrentView('admin_dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 ${
                      currentUser?.role === 'admin' ? 'bg-amber-50/80 text-[#0b2239] font-bold border-l-2 border-[#0b2239]' : 'text-slate-700'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-[#0b2239]" />
                    <div>
                      <div className="font-semibold">{t.roleAdmin}</div>
                      <div className="text-[10px] text-slate-500">{t.adminDesc}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('superadmin');
                      setShowRoleMenu(false);
                      setCurrentView('superadmin_dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 ${
                      currentUser?.role === 'superadmin' ? 'bg-amber-50/80 text-amber-900 font-bold border-l-2 border-amber-600' : 'text-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <div>
                      <div className="font-semibold">{t.roleSuperAdmin}</div>
                      <div className="text-[10px] text-slate-500">{t.superAdminDesc}</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Landing vs App Actions */}
            {currentView === 'landing' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('auth')}
                  className="px-3 py-1 text-xs font-bold text-[#0b2239] hover:text-[#123253] border border-slate-300 rounded-sm bg-white hover:bg-slate-50 transition-colors"
                >
                  {t.signIn}
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-3.5 py-1 text-xs font-bold bg-[#0b2239] hover:bg-[#123253] text-amber-300 rounded-sm border border-[#071727] shadow-xs transition-colors"
                >
                  {t.accessPortal}
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 p-1 rounded-sm border border-slate-300 hover:bg-slate-100 transition-colors"
                  title="Official Account Profile"
                >
                  <div className="w-7 h-7 rounded-2xs bg-[#0b2239] text-amber-300 font-bold text-[11px] flex items-center justify-center border border-amber-500/30">
                    {(currentUser?.name || 'User').slice(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-600 hidden sm:inline" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-sm shadow-xl border border-slate-300 py-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-200 bg-slate-50">
                      <p className="font-bold text-[#0b2239]">{currentUser?.name || 'Citizen User'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || 'citizen@gov.in'}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="gov-stamp gov-stamp-central text-[9px]">
                          {(currentUser?.role || 'user').toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {currentUser?.authProvider === 'google' ? 'Google SSO' : 'Official Password'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentView('profile_settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-600" />
                      {t.profilePreferences}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('my_research');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      {t.savedResearch}
                    </button>
                    <div className="border-t border-slate-200 my-1"></div>
                    <button
                      onClick={() => {
                        setCurrentView('landing');
                        setShowProfileMenu(false);
                        showToast(language === 'en' ? 'Signed out safely' : language === 'te' ? 'సురక్షితంగా లాగౌట్ అయ్యారు' : 'सुरक्षित रूप से लॉग आउट हो चुके हैं');
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-red-700 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t.signOut}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
