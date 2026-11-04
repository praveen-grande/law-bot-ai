import React, { useState } from 'react';
import {
  User,
  Settings,
  Shield,
  Lock,
  Globe,
  Bell,
  CheckCircle2,
  Save,
  Download,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../types/legal';

export const ProfileSettings: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    language,
    setLanguage,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'preferences' | 'profile' | 'security' | 'privacy'>('preferences');
  const [userName, setUserName] = useState(currentUser.name);
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [jurisdiction, setJurisdiction] = useState(currentUser.jurisdictionPreference);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(currentUser.theme);

  // Checkbox settings matching Screen 15
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [researchUpdates, setResearchUpdates] = useState(true);
  const [productAnnouncements, setProductAnnouncements] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: userName,
      email: userEmail,
      jurisdictionPreference: jurisdiction,
      theme
    });
    showToast('Preferences and settings updated successfully.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
          Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your research preferences, vernacular language settings, jurisdiction filters, and account security.
        </p>
      </div>

      {/* Navigation Tabs matching Mockup Screen 15 */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'preferences'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Data & Privacy</span>
          </button>
        </div>
      </div>

      {/* Preferences Form matching Mockup Screen 15 */}
      {activeTab === 'preferences' && (
        <form
          onSubmit={handleSave}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 text-xs"
        >
          {/* Language Preference matching Screen 15 */}
          <div>
            <label className="block font-bold text-slate-800 text-sm mb-1">
              Language Preference
            </label>
            <p className="text-slate-500 text-[11px] mb-3">
              Choose your primary vernacular interface and legal explanation language.
            </p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="w-full sm:w-80 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            >
              <option value="en">English (Default)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Jurisdiction Preference matching Screen 15 */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 text-sm mb-1">
              Jurisdiction Preference
            </label>
            <p className="text-slate-500 text-[11px] mb-3">
              Default scope applied when searching statutes and precedent holdings.
            </p>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full sm:w-80 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            >
              <option value="India (Central + State)">India (Central + State)</option>
              <option value="Central Union Only">Central Union Only</option>
              <option value="State High Courts & Local Acts">State High Courts & Local Acts</option>
            </select>
          </div>

          {/* Theme matching Screen 15 */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 text-sm mb-1">
              Theme
            </label>
            <p className="text-slate-500 text-[11px] mb-3">
              Select your interface display theme.
            </p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === 'light'}
                  onChange={() => setTheme('light')}
                  className="text-blue-600"
                />
                <span>Light</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === 'dark'}
                  onChange={() => setTheme('dark')}
                  className="text-blue-600"
                />
                <span>Dark</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === 'system'}
                  onChange={() => setTheme('system')}
                  className="text-blue-600"
                />
                <span>System</span>
              </label>
            </div>
          </div>

          {/* Notification Checkboxes matching Screen 15 */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center">
              <input
                id="email-notifs"
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="email-notifs" className="ml-2.5 font-medium text-slate-700 select-none">
                Email notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="research-updates"
                type="checkbox"
                checked={researchUpdates}
                onChange={(e) => setResearchUpdates(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="research-updates" className="ml-2.5 font-medium text-slate-700 select-none">
                Research updates & gazette amendments
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="product-announcements"
                type="checkbox"
                checked={productAnnouncements}
                onChange={(e) => setProductAnnouncements(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="product-announcements" className="ml-2.5 font-medium text-slate-700 select-none">
                Product announcements & new feature updates
              </label>
            </div>
          </div>

          {/* Submit Button matching Screen 15 */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all hover:shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full sm:w-80 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Account Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full sm:w-80 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <button
            onClick={() => showToast('Profile details updated')}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-xs"
          >
            Update Profile
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h3>
          <p className="text-slate-500">Enhanced protection for client notes and uploaded agreements.</p>
          <button
            onClick={() => showToast('2FA setup instructions sent to your email')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg text-xs"
          >
            Configure 2FA
          </button>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Data Retention & Confidentiality</h3>
          <p className="text-slate-600 leading-relaxed">
            Uploaded contracts and conversation history are isolated strictly to your account session. No confidential documents are used for public model training.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => showToast('Research workspace archive exported (.json)')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Research Archive</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
