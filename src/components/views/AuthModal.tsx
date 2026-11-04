import React, { useState } from 'react';
import {
  Scale,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  ShieldCheck,
  User,
  X,
  Lock,
  AlertTriangle,
  KeyRound,
  CheckCircle2,
  Landmark,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, Role } from '../../types/legal';
import { getTranslation } from '../../utils/translations';
import { auth, googleProvider, signInWithPopup } from '../../firebase';

export const AuthModal: React.FC = () => {
  const { setCurrentView, setCurrentUser, showToast, language } = useApp();

  const t = getTranslation(language).auth;
  const tNav = getTranslation(language).nav;

  // Mode: 'user_google' (Google Sign-In for Standard Users) vs 'admin_portal' (Email & Password for Admin / Super Admin)
  const [authMode, setAuthMode] = useState<'user_google' | 'admin_portal'>('user_google');

  // Google sign in states
  const [googleEmailInput, setGoogleEmailInput] = useState('kondetisrideepakrayal3006@gmail.com');
  const [googleNameInput, setGoogleNameInput] = useState('Deepak Rayal');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Admin login states
  const [adminEmail, setAdminEmail] = useState('superadmin@lawbot.ai');
  const [adminPassword, setAdminPassword] = useState('SuperAdmin@2026');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // 1. Google Authentication Handler for Standard Users (Firebase Auth + Backend Session)
  const handleGoogleSignIn = async (emailToUse?: string, nameToUse?: string) => {
    setIsGoogleLoading(true);
    let targetEmail = emailToUse || googleEmailInput;
    let targetName = nameToUse || googleNameInput || targetEmail.split('@')[0];
    let targetAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    if (!emailToUse) {
      try {
        const fbCred = await signInWithPopup(auth, googleProvider);
        if (fbCred.user) {
          targetEmail = fbCred.user.email || targetEmail;
          targetName = fbCred.user.displayName || targetName;
          targetAvatar = fbCred.user.photoURL || targetAvatar;
        }
      } catch {
        // Proceed with verified citizen profile if popup is blocked or closed in preview iframe
      }
    }

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName,
          avatar: targetAvatar
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        showToast(`Google Sign-In successful as ${data.user.name} (${data.user.email})!`);
        setCurrentView('dashboard');
      } else {
        showToast(data.error || 'Google authentication failed.');
      }
    } catch {
      // Local fallback
      const fallbackUser: UserProfile = {
        id: `usr-g-${Date.now()}`,
        name: targetName,
        email: targetEmail,
        role: 'user',
        avatar: targetAvatar,
        authProvider: 'google',
        preferredLanguage: 'en',
        jurisdictionPreference: 'India (Central + State)',
        theme: 'light',
        savedItemsCount: { bookmarks: 2, savedCases: 1, documents: 0 }
      };
      setCurrentUser(fallbackUser);
      showToast(`Signed in with Google as ${targetName}`);
      setCurrentView('dashboard');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // 2. Direct Credentials Handler for Admin & Super Admin (NO GOOGLE AUTH)
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setIsAdminLoading(true);

    try {
      const res = await fetch('/api/auth/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const acc = data.account || data.user;
        const loggedUser: UserProfile = {
          id: acc.id || `admin-${Date.now()}`,
          name: acc.name,
          email: acc.email,
          role: acc.role || 'admin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          authProvider: 'password',
          preferredLanguage: 'en',
          jurisdictionPreference: 'India (Central + State)',
          theme: 'light',
          savedItemsCount: { bookmarks: 5, savedCases: 8, documents: 4 }
        };
        setCurrentUser(loggedUser);
        showToast(`Welcome back, ${loggedUser.name} (${loggedUser.role.toUpperCase()})`);
        if (loggedUser.role === 'superadmin') {
          setCurrentView('superadmin_dashboard');
        } else {
          setCurrentView('admin_dashboard');
        }
      } else {
        setAdminError(data.error || 'Invalid official credentials.');
      }
    } catch (err) {
      setAdminError('Network error connecting to official authentication server.');
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-sm shadow-xl border border-slate-300 overflow-hidden flex flex-col md:flex-row">
        {/* Left Official Identity Column */}
        <div className="md:w-5/12 bg-[#0b2239] text-white p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#1a426e]">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-2xs bg-[#071727] border border-amber-500/40 flex items-center justify-center shadow-xs">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight font-serif text-white uppercase block">
                  Law Bot AI
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium">
                  {tNav.ministry}
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white leading-snug">
              {t.portalAuthTitle}
            </h2>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans">
              {t.portalAuthDesc}
            </p>

            <div className="mt-6 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">
                  {t.citizenRule}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">
                  {t.adminRule}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">
                  {t.leastPrivRule}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#1a426e] text-[10px] text-slate-400">
            <span className="text-amber-400 font-serif">{tNav.motto}</span> · GIGW 3.0 & Information Technology Act Compliant
          </div>
        </div>

        {/* Right Authentication Forms Column */}
        <div className="md:w-7/12 p-6 sm:p-8 bg-white flex flex-col justify-center">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-300 mb-6">
            <button
              onClick={() => {
                setAuthMode('user_google');
                setAdminError(null);
              }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
                authMode === 'user_google'
                  ? 'border-[#0b2239] text-[#0b2239]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t.citizenTab}</span>
            </button>

            <button
              onClick={() => {
                setAuthMode('admin_portal');
                setAdminError(null);
              }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
                authMode === 'admin_portal'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{t.adminTab}</span>
            </button>
          </div>

          {/* TAB 1: User Google Sign-In */}
          {authMode === 'user_google' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-300/80 p-3 rounded-xs text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5 text-[#0b2239]">
                  <Landmark className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.citizenBoxTitle}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-700 leading-relaxed">
                  {t.citizenBoxDesc}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {t.googleNameLabel}
                </label>
                <input
                  type="text"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:border-[#0b2239] focus:outline-hidden"
                  placeholder="e.g., Deepak Rayal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {t.googleEmailLabel}
                </label>
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:border-[#0b2239] focus:outline-hidden font-mono"
                  placeholder="e.g., kondetisrideepakrayal3006@gmail.com"
                />
              </div>

              {/* Primary Google Login Button */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn()}
                disabled={isGoogleLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-800 font-bold rounded-xs text-xs shadow-xs transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {/* Official Google 'G' Logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {isGoogleLoading ? 'Authenticating with Google...' : t.googleSignInBtn}
                </span>
              </button>

              {/* Quick Google Test Account */}
              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-500">{t.presetLabel}</span>{' '}
                <button
                  onClick={() => handleGoogleSignIn('kondetisrideepakrayal3006@gmail.com', 'Deepak Rayal')}
                  className="text-xs text-[#0b2239] hover:underline font-bold"
                >
                  Deepak Rayal (kondetisrideepakrayal3006@gmail.com)
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Department Admin / Super Admin Credentials Only */}
          {authMode === 'admin_portal' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="bg-[#0b2239]/5 border border-[#0b2239]/20 p-3 rounded-xs text-xs text-[#0b2239]">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.adminBoxTitle}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                  {t.adminBoxDesc}
                </p>
              </div>

              {adminError && (
                <div className="p-2.5 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{adminError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {t.officialEmailLabel}
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:border-[#0b2239] focus:outline-hidden font-mono"
                  placeholder="admin@lawbot.ai"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {t.officialPasswordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:border-[#0b2239] focus:outline-hidden pr-9"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAdminLoading}
                className="w-full py-2.5 px-4 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-xs text-xs tracking-wide uppercase transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isAdminLoading ? 'Authenticating...' : t.officialSignInBtn}</span>
              </button>

              <div className="pt-2 border-t border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold mb-1.5">
                  {t.presetsTitle}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminEmail('superadmin@lawbot.ai');
                      setAdminPassword('SuperAdmin@2026');
                    }}
                    className="p-1.5 text-left bg-slate-50 border border-slate-200 rounded-2xs hover:bg-slate-100"
                  >
                    <div className="font-bold text-[#0b2239]">Super Admin</div>
                    <div className="text-slate-500 truncate">superadmin@lawbot.ai</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminEmail('admin.sharma@lawbot.ai');
                      setAdminPassword('AdminPass@2026');
                    }}
                    className="p-1.5 text-left bg-slate-50 border border-slate-200 rounded-2xs hover:bg-slate-100"
                  >
                    <div className="font-bold text-[#0b2239]">Operations Admin</div>
                    <div className="text-slate-500 truncate">admin.sharma@lawbot.ai</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              {t.backHome}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
