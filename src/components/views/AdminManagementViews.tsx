import React, { useState } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  AlertCircle,
  Database,
  RefreshCw,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Check,
  FileCheck,
  Landmark,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types/legal';
import { getTranslation } from '../../utils/translations';

export const AdminManagementViews: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    sources,
    triggerSync,
    feedbackList,
    syncLogs,
    language,
    showToast
  } = useApp();

  const t = getTranslation(language).admin;

  const [filterUserSearch, setFilterUserSearch] = useState('');
  const [selectedSourceForSchedule, setSelectedSourceForSchedule] = useState(sources[0]?.id);

  // Mocked authorized user roster
  const [usersList, setUsersList] = useState([
    { id: 'u-1', name: 'Rahul Sharma', email: 'rahul.s@example.com', role: 'user' as Role, joined: '12 Jan 2024', status: 'Active' },
    { id: 'u-2', name: 'Adv. Sneha Patel', email: 'sneha@univ.edu', role: 'admin' as Role, joined: '03 Feb 2024', status: 'Active' },
    { id: 'u-3', name: 'Arjun Verma', email: 'arjun@lawfirm.com', role: 'user' as Role, joined: '18 Mar 2024', status: 'Active' },
    { id: 'u-4', name: 'Priya Narayanan', email: 'priya123@example.com', role: 'user' as Role, joined: '22 Apr 2024', status: 'Active' },
    { id: 'u-5', name: 'Vikramaditya Rao', email: 'vikram@lawbot.ai', role: 'superadmin' as Role, joined: '01 Jan 2024', status: 'Active' }
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* View 1: User Management */}
      {currentView === 'user_management' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0b2239]">
                {t.userMgmtTitle}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Manage registered citizen legal researchers, advocate accounts, and administrative roles.
              </p>
            </div>

            {currentUser.role === 'superadmin' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('superadmin_dashboard')}
                  className="px-3.5 py-2 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-2xs text-xs flex items-center gap-1.5 shadow-xs transition-colors border border-[#071727]"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Provision Admin Credentials</span>
                </button>
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-2xs text-slate-600 text-[11px] font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#0b2239]" />
                <span>Admin Provisioning: Super Admin Authorization Required</span>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={filterUserSearch}
                  onChange={(e) => setFilterUserSearch(e.target.value)}
                  placeholder="Filter users by email or name..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-2xs border border-slate-300 text-xs focus:border-[#0b2239] focus:outline-hidden"
                />
              </div>

              <div className="text-[11px] text-[#0b2239] bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-2xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>Security Guard:</strong> Citizens sign in with Google SSO. Admin credentials strictly provisioned by Super Admin.</span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-300 rounded-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b2239] text-amber-300 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Joined</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {usersList
                    .filter((u) => u.name.toLowerCase().includes(filterUserSearch.toLowerCase()) || u.email.toLowerCase().includes(filterUserSearch.toLowerCase()))
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-[#0b2239]">{user.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`gov-stamp ${
                              user.role === 'superadmin'
                                ? 'gov-stamp-gold'
                                : user.role === 'admin'
                                ? 'gov-stamp-central'
                                : 'border-slate-300 bg-slate-100 text-slate-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{user.joined}</td>
                        <td className="py-2.5 px-3">
                          <span className="gov-stamp gov-stamp-active">{user.status}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => showToast(`User ${user.email} permissions reviewed.`)}
                            className="text-[#0b2239] hover:underline font-bold text-xs"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Feedback & Citation Moderation */}
      {currentView === 'feedback_moderation' && (
        <div className="space-y-6">
          <div className="border-b border-slate-300 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0b2239]">
              {t.feedbackTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Review citation inaccuracy reports, outdated section alerts, and legal RAG feedback submissions.
            </p>
          </div>

          <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs divide-y divide-slate-200 text-xs">
            {feedbackList.map((fb) => (
              <div key={fb.id} className="py-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0b2239] text-sm">{fb.description}</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded-2xs text-[10px] font-mono text-slate-700 border border-slate-200">
                      {fb.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`gov-stamp ${
                        fb.status === 'Open'
                          ? 'gov-stamp-gold'
                          : fb.status === 'In Review'
                          ? 'gov-stamp-central'
                          : 'gov-stamp-active'
                      }`}
                    >
                      {fb.status}
                    </span>
                    <button
                      onClick={() => {
                        fb.status = fb.status === 'Open' ? 'In Review' : 'Resolved';
                        showToast(`Status updated to ${fb.status}`);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-[#0b2239] rounded-2xs text-xs border border-slate-300"
                    >
                      Advance Status
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Reported by {fb.userEmail} · Submitted {fb.submittedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Legal Source Registry & Scheduled Synchronization */}
      {currentView === 'legal_sources' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0b2239]">
                {t.sourcesTitle}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Configurable scheduled synchronization across official Indian gazettes and court repositories.
              </p>
            </div>

            <button
              onClick={() => triggerSync()}
              className="px-4 py-2 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-2xs text-xs flex items-center gap-1.5 shadow-xs border border-[#071727]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run Incremental Sync Now</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sources List */}
            <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs space-y-4 text-xs">
              <h3 className="font-bold text-[#0b2239] uppercase tracking-wider text-[11px] font-serif border-b border-slate-200 pb-2">
                Registered Official Repositories ({sources.length})
              </h3>

              <div className="space-y-3">
                {sources.map((src) => (
                  <div key={src.id} className="p-3.5 bg-slate-50 rounded-2xs border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#0b2239] text-xs sm:text-sm">{src.name}</div>
                      <span
                        className={`gov-stamp ${
                          src.status === 'Success'
                            ? 'gov-stamp-active'
                            : 'gov-stamp-gold'
                        }`}
                      >
                        {src.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600">
                      Authority: {src.authority} · Domain: {src.domain}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                      <span className="font-semibold text-slate-700">
                        {src.docCount.toLocaleString()} indexed records · {src.syncFrequency}
                      </span>
                      <button
                        onClick={() => triggerSync(src.id)}
                        className="text-[#0b2239] hover:underline font-bold"
                      >
                        Sync Source
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingestion & Sync Execution Logs */}
            <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs space-y-4 text-xs">
              <h3 className="font-bold text-[#0b2239] uppercase tracking-wider text-[11px] flex items-center gap-2 font-serif border-b border-slate-200 pb-2">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Recent Ingestion & Scheduler Runs</span>
              </h3>

              <div className="space-y-3">
                {syncLogs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-slate-50 rounded-2xs border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0b2239]">{log.sourceName}</span>
                      <span className="gov-stamp gov-stamp-active text-[9px]">
                        {log.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">{log.details}</p>

                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      New: +{log.newDocs} · Updated: ~{log.updatedDocs} · Checked: {log.duplicateDocs}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 4: System Health & Logs */}
      {currentView === 'system_health' && (
        <div className="space-y-6">
          <div className="border-b border-slate-300 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0b2239]">
              {t.healthTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Service latencies, vector embedding status, and background worker scheduler health.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs text-xs space-y-2">
              <span className="text-slate-600 font-bold uppercase text-[10px]">RAG Vector Index</span>
              <div className="text-xl font-bold text-emerald-800 font-serif">Operational (100%)</div>
              <p className="text-[11px] text-slate-500">BM25 + Semantic Cosine index updated.</p>
            </div>

            <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs text-xs space-y-2">
              <span className="text-slate-600 font-bold uppercase text-[10px]">AI Inference Latency</span>
              <div className="text-xl font-bold text-[#0b2239] font-serif">420 ms avg</div>
              <p className="text-[11px] text-slate-500">Gemini 2.5 Flash & Local RAG ready.</p>
            </div>

            <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs text-xs space-y-2">
              <span className="text-slate-600 font-bold uppercase text-[10px]">Scheduler Worker</span>
              <div className="text-xl font-bold text-amber-800 font-serif">Active Cron</div>
              <p className="text-[11px] text-slate-500">Next scheduled check: 24h.</p>
            </div>
          </div>
        </div>
      )}

      {/* View 5: General Admin Dashboard */}
      {currentView === 'admin_dashboard' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-300 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0b2239]">
                {t.opsConsoleTitle}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Overview of user feedback triage, source sync status, and system operational integrity.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div
              onClick={() => setCurrentView('feedback_moderation')}
              className="bg-white p-5 rounded-sm border border-slate-300 hover:border-[#0b2239] cursor-pointer transition-all shadow-2xs"
            >
              <div className="w-8 h-8 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-2">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#0b2239] font-serif">Queries & Feedback</h3>
              <p className="text-slate-600 mt-1">{feedbackList.length} reported issues</p>
            </div>

            <div
              onClick={() => setCurrentView('legal_sources')}
              className="bg-white p-5 rounded-sm border border-slate-300 hover:border-[#0b2239] cursor-pointer transition-all shadow-2xs"
            >
              <div className="w-8 h-8 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-2">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#0b2239] font-serif">Legal Sources</h3>
              <p className="text-slate-600 mt-1">{sources.length} active repositories</p>
            </div>

            <div
              onClick={() => setCurrentView('user_management')}
              className="bg-white p-5 rounded-sm border border-slate-300 hover:border-[#0b2239] cursor-pointer transition-all shadow-2xs"
            >
              <div className="w-8 h-8 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#0b2239] font-serif">User Management</h3>
              <p className="text-slate-600 mt-1">Review active researchers</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
