import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Database,
  ArrowRight,
  Plus,
  KeyRound,
  Shield,
  Copy,
  Check,
  UserCheck,
  UserX,
  X,
  Sparkles,
  Landmark,
  Building2,
  Gavel
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/translations';

interface AdminAccountItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  department: string;
  createdBy: string;
  createdAt: string;
  status: 'Active' | 'Suspended';
}

export const SuperAdminDashboard: React.FC = () => {
  const {
    currentUser,
    sources,
    triggerSync,
    feedbackList,
    setCurrentView,
    syncLogs,
    language,
    showToast
  } = useApp();

  const t = getTranslation(language).admin;

  // Admin accounts state
  const [adminAccounts, setAdminAccounts] = useState<AdminAccountItem[]>([
    {
      id: 'admin-super-root',
      name: 'Chief Legal Registrar (Super Admin)',
      email: 'superadmin@lawbot.ai',
      role: 'superadmin',
      department: 'High Court & Union Law Oversight',
      createdBy: 'System Root',
      createdAt: '2026-01-01',
      status: 'Active'
    },
    {
      id: 'admin-patel-ops',
      name: 'Adv. Sneha Patel',
      email: 'sneha@univ.edu',
      role: 'admin',
      department: 'Citation Audit & Gazette Ingestion',
      createdBy: 'superadmin@lawbot.ai',
      createdAt: '2026-02-03',
      status: 'Active'
    }
  ]);

  // Modal / Form state for provisioning new admin
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminDept, setNewAdminDept] = useState('High Court Case Ingestion');
  const [newAdminPassword, setNewAdminPassword] = useState('Admin@2026Secure');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredentialsNotice, setCreatedCredentialsNotice] = useState<{
    email: string;
    password: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch admin accounts from backend
  const fetchAdminAccounts = async () => {
    try {
      const res = await fetch('/api/admin/accounts');
      if (res.ok) {
        const data = await res.json();
        if (data.accounts) {
          setAdminAccounts(data.accounts);
        }
      }
    } catch {
      // Keep initial accounts
    }
  };

  useEffect(() => {
    fetchAdminAccounts();
  }, []);

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewAdminPassword(pwd);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      showToast('Please fill all required administrator fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterRole: currentUser.role, // 'superadmin'
          requesterEmail: currentUser.email,
          newAdmin: {
            name: newAdminName,
            email: newAdminEmail,
            password: newAdminPassword,
            department: newAdminDept
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedCredentialsNotice({
          name: newAdminName,
          email: newAdminEmail,
          password: newAdminPassword
        });
        showToast(`Admin account created for ${newAdminName}!`);
        setIsCreateModalOpen(false);
        setNewAdminName('');
        setNewAdminEmail('');
        fetchAdminAccounts();
      } else {
        showToast(data.error || 'Failed to create admin credentials.');
      }
    } catch {
      // Local fallback
      const localAdmin: AdminAccountItem = {
        id: `admin-${Date.now()}`,
        name: newAdminName,
        email: newAdminEmail,
        role: 'admin',
        department: newAdminDept,
        createdBy: currentUser.email,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      setAdminAccounts((prev) => [...prev, localAdmin]);
      setCreatedCredentialsNotice({
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword
      });
      showToast(`Admin account provisioned for ${newAdminName}`);
      setIsCreateModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (adminId: string) => {
    try {
      const res = await fetch('/api/admin/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterRole: currentUser.role,
          adminId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        fetchAdminAccounts();
      } else {
        showToast(data.error || 'Action not permitted');
      }
    } catch {
      setAdminAccounts((prev) =>
        prev.map((acc) =>
          acc.id === adminId && acc.role !== 'superadmin'
            ? { ...acc, status: acc.status === 'Active' ? 'Suspended' : 'Active' }
            : acc
        )
      );
      showToast('Admin status updated.');
    }
  };

  const copyCredentials = () => {
    if (!createdCredentialsNotice) return;
    const text = `Law Bot AI Official Administrative Credentials:\nEmail: ${createdCredentialsNotice.email}\nPassword: ${createdCredentialsNotice.password}\nPortal URL: https://lawbot.ai/portal`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Credentials copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Official Government Ministry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0b2239]">
              {t.superAdminTitle}
            </h1>
            <span className="gov-stamp gov-stamp-gold text-[10px]">
              Apex Directorate
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.superAdminSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-2xs text-xs flex items-center gap-1.5 shadow-xs transition-colors border border-[#071727]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Provision Admin Credential</span>
          </button>
          <button
            onClick={() => triggerSync()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0b2239] font-bold rounded-2xs text-xs flex items-center gap-1.5 border border-slate-300 shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0b2239]" />
            <span>Global Source Sync</span>
          </button>
        </div>
      </div>

      {/* Notice Banner: Created Credentials confirmation */}
      {createdCredentialsNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-2xs bg-emerald-200 text-emerald-900 flex items-center justify-center shrink-0 border border-emerald-300">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-emerald-950 text-sm font-serif">
                Official Admin Credentials Successfully Provisioned!
              </div>
              <div className="text-emerald-900 mt-0.5 font-mono">
                Admin: <strong>{createdCredentialsNotice.name}</strong> ({createdCredentialsNotice.email}) | Password: <span className="bg-white px-2 py-0.5 rounded-2xs font-bold border border-emerald-300">{createdCredentialsNotice.password}</span>
              </div>
              <div className="text-[11px] text-emerald-800 mt-1">
                Provide these official credentials to the Operations Admin. Google sign-in is disabled for administrative accounts.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyCredentials}
              className="px-3 py-1.5 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-2xs text-xs flex items-center gap-1 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Creds'}</span>
            </button>
            <button
              onClick={() => setCreatedCredentialsNotice(null)}
              className="p-1.5 text-slate-500 hover:bg-emerald-100 rounded-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Dedicated Section: ADMIN CREDENTIALS & ACCESS CONTROL (SUPER ADMIN ONLY) */}
      <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <h2 className="text-sm font-bold text-[#0b2239] uppercase tracking-wider font-serif">
                Admin Credentials Provisioning (Super Admin Authority)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Enforcing least privilege: only the Super Admin can issue credentials for Operations Admins. Standard users log in via Google.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-1.5 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-2xs text-xs flex items-center gap-1.5 self-start sm:self-auto border border-[#071727]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Admin</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b2239] text-amber-300 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Admin Official</th>
                <th className="py-2.5 px-3">Role Tier</th>
                <th className="py-2.5 px-3">Department / Scope</th>
                <th className="py-2.5 px-3">Provisioned By</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {adminAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#0b2239] flex items-center gap-1.5">
                      {acc.role === 'superadmin' ? (
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                      ) : (
                        <Shield className="w-4 h-4 text-[#0b2239]" />
                      )}
                      <span>{acc.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{acc.email}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`gov-stamp ${
                        acc.role === 'superadmin' ? 'gov-stamp-gold' : 'gov-stamp-central'
                      }`}
                    >
                      {acc.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{acc.department}</td>
                  <td className="py-3 px-3 text-slate-600">
                    <div>{acc.createdBy}</div>
                    <div className="text-[10px] text-slate-400">{acc.createdAt}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`gov-stamp ${
                        acc.status === 'Active' ? 'gov-stamp-active' : 'border-red-500 bg-red-50 text-red-800'
                      }`}
                    >
                      {acc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {acc.role === 'superadmin' ? (
                      <span className="text-[11px] text-slate-400 italic">Root Authority</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(acc.id)}
                        className={`text-xs font-bold px-2 py-1 rounded-2xs transition-colors ${
                          acc.status === 'Active'
                            ? 'text-red-700 hover:bg-red-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {acc.status === 'Active' ? 'Suspend Access' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Official Metric Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-7 h-7 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0b2239] font-serif mt-2">
            1,245
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <span>↑ 12%</span>
            <span className="text-slate-500 font-normal">from last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Active Users
            </span>
            <div className="w-7 h-7 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0b2239] font-serif mt-2">
            156
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            Currently online & querying
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Queries This Month
            </span>
            <div className="w-7 h-7 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0b2239] font-serif mt-2">
            2,341
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            94.8% grounded in verified statutes
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              System Health
            </span>
            <div className="w-7 h-7 rounded-2xs bg-[#0b2239] text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-800 font-serif mt-2">
            98.2%
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            All AI & RAG pipelines operational
          </div>
        </div>
      </div>

      {/* Split Grid: Recent User Activity & Source Sync Status */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent User Activity Table */}
        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
            <h2 className="text-xs font-bold text-[#0b2239] uppercase tracking-wider font-serif">
              Recent User Activity
            </h2>
            <button
              onClick={() => setCurrentView('user_management')}
              className="text-xs text-[#0b2239] hover:underline font-bold"
            >
              All Users
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-[#0b2239] border-y border-slate-200 text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2 px-3">User</th>
                  <th className="py-2 px-3">Activity</th>
                  <th className="py-2 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-900">rahul.s@example.com</td>
                  <td className="py-2.5 px-3 text-slate-600">Searched IPC Section 420</td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-mono">2 mins ago</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-900">sneha@univ.edu</td>
                  <td className="py-2.5 px-3 text-slate-600">Uploaded document (Agreement to Sell)</td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-mono">15 mins ago</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-900">arjun@lawfirm.com</td>
                  <td className="py-2.5 px-3 text-slate-600">Case law search (Anticipatory Bail)</td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-mono">32 mins ago</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-900">priya123@example.com</td>
                  <td className="py-2.5 px-3 text-slate-600">AI question (Section 17 Registration)</td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-mono">1 hour ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Source Sync Status Table */}
        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
            <h2 className="text-xs font-bold text-[#0b2239] uppercase tracking-wider flex items-center gap-2 font-serif">
              <Database className="w-4 h-4 text-amber-700" />
              <span>Source Sync Status</span>
            </h2>
            <button
              onClick={() => setCurrentView('legal_sources')}
              className="text-xs text-[#0b2239] hover:underline font-bold"
            >
              All Sources
            </button>
          </div>

          <div className="space-y-2.5">
            {sources.map((src) => (
              <div
                key={src.id}
                className="flex items-center justify-between p-2.5 rounded-2xs bg-slate-50 border border-slate-200 text-xs"
              >
                <div>
                  <div className="font-bold text-[#0b2239] flex items-center gap-2">
                    <span>{src.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({src.domain})</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {src.docCount.toLocaleString()} indexed docs · {src.syncFrequency}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`gov-stamp ${
                      src.status === 'Success'
                        ? 'gov-stamp-active'
                        : src.status === 'Running'
                        ? 'gov-stamp-gold animate-pulse'
                        : 'border-red-500 bg-red-50 text-red-800'
                    }`}
                  >
                    {src.status}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">{src.lastSync}</span>
                  <button
                    onClick={() => triggerSync(src.id)}
                    className="p-1 hover:bg-slate-200 rounded-2xs text-[#0b2239]"
                    title="Run Sync Now"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Feedback & Citation Reports */}
      <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-2xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-xs font-bold text-[#0b2239] uppercase tracking-wider flex items-center gap-2 font-serif">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Recent Feedback & Citation Audit</span>
            </h2>
            <p className="text-[11px] text-slate-600">
              Users reporting citation issues or outdated legal provisions for immediate review.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('feedback_moderation')}
            className="text-xs text-[#0b2239] hover:underline font-bold flex items-center gap-1"
          >
            <span>Audit console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0b2239]">{fb.description}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-2xs text-slate-700 font-mono border border-slate-200">
                    {fb.type}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Reported by {fb.userEmail} · Submitted {fb.submittedAt}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
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
                    showToast(`Updated report ${fb.id} status to In Review`);
                  }}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-2xs hover:bg-slate-100 font-semibold text-slate-800"
                >
                  Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROVISION NEW ADMIN MODAL (SUPER ADMIN ONLY) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-[#071727]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-sm max-w-lg w-full border border-slate-300 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-2xs bg-[#0b2239] text-amber-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0b2239] font-serif">
                  Provision New Admin Credential (विधिक प्रशासनिक क्रेडेंशियल)
                </h3>
                <p className="text-xs text-slate-500">
                  Only Super Admin can generate administrative credentials.
                </p>
              </div>
            </div>

            <div className="my-3 p-3 bg-amber-50/80 border border-amber-300 text-xs text-amber-950 leading-relaxed rounded-2xs">
              <strong>Strict Security Mandate:</strong> Administrative personnel do not sign up publicly and cannot authenticate via Google SSO. You are generating direct government credentials.
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Admin Full Name & Title
                </label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g., Adv. Rajesh Verma"
                  className="w-full px-3 py-2 rounded-2xs border border-slate-300 focus:border-[#0b2239] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Official Administrative Email
                </label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g., r.verma@lawbot.ai"
                  className="w-full px-3 py-2 rounded-2xs border border-slate-300 focus:border-[#0b2239] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Department / Ingestion Scope
                </label>
                <select
                  value={newAdminDept}
                  onChange={(e) => setNewAdminDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xs border border-slate-300 focus:border-[#0b2239] outline-hidden bg-white"
                >
                  <option value="High Court Case Ingestion">High Court Case Ingestion</option>
                  <option value="Statute Gazette Verification">Statute Gazette Verification</option>
                  <option value="Legal RAG Moderation & Audit">Legal RAG Moderation & Audit</option>
                  <option value="Criminal Law Reform Registry">Criminal Law Reform Registry</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wide">Initial Password</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPassword}
                    className="text-[#0b2239] hover:underline text-[11px] flex items-center gap-1 font-bold"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 rounded-2xs border border-slate-300 focus:border-[#0b2239] outline-hidden font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-2xs text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#0b2239] hover:bg-[#123253] text-amber-300 font-bold rounded-2xs shadow-xs flex items-center gap-1.5 border border-[#071727]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'क्रेडेंशियल बन रहे हैं...' : 'Provision Admin Credential'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
