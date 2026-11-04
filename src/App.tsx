import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/views/LandingPage';
import { AuthModal } from './components/views/AuthModal';
import { UserDashboard } from './components/views/UserDashboard';
import { SuperAdminDashboard } from './components/views/SuperAdminDashboard';
import { AskLawBot } from './components/views/AskLawBot';
import { LegalSearch } from './components/views/LegalSearch';
import { ActsSectionsExplorer } from './components/views/ActsSectionsExplorer';
import { CaseLawExplorer } from './components/views/CaseLawExplorer';
import { JudgmentDetail } from './components/views/JudgmentDetail';
import { DocumentAnalysis } from './components/views/DocumentAnalysis';
import { LegalTopicExplorer } from './components/views/LegalTopicExplorer';
import { LegalComparisonTool } from './components/views/LegalComparisonTool';
import { MyResearch } from './components/views/MyResearch';
import { ProfileSettings } from './components/views/ProfileSettings';
import { FeedbackSupport } from './components/views/FeedbackSupport';
import { ChatHistoryView } from './components/views/ChatHistoryView';
import { AdminManagementViews } from './components/views/AdminManagementViews';
import { DatasetManagement } from './components/views/DatasetManagement';
import { AdminPortalGate } from './components/views/AdminPortalGate';
import { CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, toastMessage, currentUser } = useApp();

  // Screen 1: Landing Page (Full View)
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <LandingPage />
        {toastMessage && <ToastBanner message={toastMessage} />}
      </div>
    );
  }

  // Screen 2: Auth View (Full View or Modal)
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <AuthModal />
        {toastMessage && <ToastBanner message={toastMessage} />}
      </div>
    );
  }

  // Screens 3 to 15: Application Layout with Top Navbar + Left Vertical Sidebar
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && <UserDashboard />}
          {currentView === 'superadmin_dashboard' && (
            currentUser.role === 'superadmin' ? (
              <SuperAdminDashboard />
            ) : (
              <AdminPortalGate requiredRole="superadmin" />
            )
          )}
          {currentView === 'ask_law_bot' && <AskLawBot />}
          {currentView === 'legal_search' && <LegalSearch />}
          {currentView === 'acts_sections' && <ActsSectionsExplorer />}
          {currentView === 'case_law' && <CaseLawExplorer />}
          {currentView === 'judgment_detail' && <JudgmentDetail />}
          {currentView === 'document_analysis' && <DocumentAnalysis />}
          {currentView === 'legal_topics' && <LegalTopicExplorer />}
          {currentView === 'comparison_tool' && <LegalComparisonTool />}
          {currentView === 'my_research' && <MyResearch />}
          {currentView === 'profile_settings' && <ProfileSettings />}
          {currentView === 'feedback_support' && <FeedbackSupport />}
          {currentView === 'chat_history' && <ChatHistoryView />}
          {currentView === 'dataset_management' && <DatasetManagement />}
          {(currentView === 'admin_dashboard' ||
            currentView === 'user_management' ||
            currentView === 'legal_sources' ||
            currentView === 'feedback_moderation' ||
            currentView === 'system_health') && (
            currentUser.role === 'admin' || currentUser.role === 'superadmin' ? (
              <AdminManagementViews />
            ) : (
              <AdminPortalGate requiredRole="admin" />
            )
          )}
        </main>
      </div>

      {toastMessage && <ToastBanner message={toastMessage} />}
    </div>
  );
};

const ToastBanner: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
