
import React, { useState, useEffect } from 'react';
import { Language, ModuleType, MeetingActivity } from './types';
import { TRANSLATIONS, PASSWORDS } from './constants';
import AuthGate from './components/AuthGate';
import MeetingRoom from './components/MeetingRoom';
import ActivityLog from './components/ActivityLog';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.HOME);
  const [authPending, setAuthPending] = useState<ModuleType | null>(null);
  const [activities, setActivities] = useState<MeetingActivity[]>([]);

  const t = TRANSLATIONS[lang];

  // Load activities from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ptm_activities');
    if (saved) {
      try {
        setActivities(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse activities', e);
      }
    }
  }, []);

  // Save activities when they change
  useEffect(() => {
    localStorage.setItem('ptm_activities', JSON.stringify(activities));
  }, [activities]);

  const handleModuleClick = (module: ModuleType) => {
    if (module === ModuleType.TEACHER || module === ModuleType.RECENT_ACTIVITY) {
      setAuthPending(module);
    } else {
      setActiveModule(module);
    }
  };

  const handleAuthSuccess = () => {
    if (authPending) {
      setActiveModule(authPending);
      setAuthPending(null);
    }
  };

  const recordMeeting = (duration: number) => {
    if (duration < 5) return; // Ignore very short sessions
    const newActivity: MeetingActivity = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      role: activeModule as 'PARENTS' | 'TEACHER',
      duration,
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const renderModule = () => {
    switch (activeModule) {
      case ModuleType.PARENTS:
        return <MeetingRoom role="PARENTS" translations={t} onEnd={recordMeeting} />;
      case ModuleType.TEACHER:
        return <MeetingRoom role="TEACHER" translations={t} onEnd={recordMeeting} />;
      case ModuleType.RECENT_ACTIVITY:
        return <ActivityLog activities={activities} translations={t} />;
      default:
        return (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-16">
              <div className="inline-block p-3 bg-indigo-100 rounded-3xl mb-4 text-indigo-600">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 01-4-4 4 4 0 014-4 4 4 0 014 4 4 4 0 01-4 4zm7-3l5 5-5 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">{t.title}</h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Parent Card */}
              <div 
                onClick={() => handleModuleClick(ModuleType.PARENTS)}
                className="group cursor-pointer bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-emerald-100 transition-all transform hover:-translate-y-2 border border-slate-100"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{t.parentsBtn}</h3>
                <p className="text-slate-500 mb-6 text-sm">Join the teacher's session using a Meeting ID.</p>
                <span className="text-emerald-600 font-bold text-sm inline-flex items-center gap-2">
                  {t.joinMeeting} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>

              {/* Teacher Card */}
              <div 
                onClick={() => handleModuleClick(ModuleType.TEACHER)}
                className="group cursor-pointer bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-indigo-100 transition-all transform hover:-translate-y-2 border border-slate-100"
              >
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{t.teacherBtn}</h3>
                <p className="text-slate-500 mb-6 text-sm">Create a session and share the ID with parents. (PW: 001)</p>
                <span className="text-indigo-600 font-bold text-sm inline-flex items-center gap-2">
                  {t.createMeeting} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>

              {/* Activity Card */}
              <div 
                onClick={() => handleModuleClick(ModuleType.RECENT_ACTIVITY)}
                className="group cursor-pointer bg-slate-900 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-slate-800 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t.activityBtn}</h3>
                <p className="text-slate-400 mb-6 text-sm">View logs and session history. (PW: 003)</p>
                <span className="text-indigo-400 font-bold text-sm inline-flex items-center gap-2">
                  View Logs <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveModule(ModuleType.HOME)}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-110 transition">P</div>
            <span className="text-xl font-bold text-slate-800 hidden sm:block">PTM<span className="text-indigo-600">Connect</span></span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
            >
              {t.languageToggle}
            </button>
            {activeModule !== ModuleType.HOME && (
              <button 
                onClick={() => setActiveModule(ModuleType.HOME)}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition"
              >
                {t.backToHome}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mt-8 animate-in fade-in duration-500">
        {renderModule()}
      </main>

      {/* Auth Modal */}
      {authPending && (
        <AuthGate 
          translations={t}
          expectedPassword={authPending === ModuleType.TEACHER ? PASSWORDS.TEACHER : PASSWORDS.RECENT_ACTIVITY}
          onSuccess={handleAuthSuccess}
          onCancel={() => setAuthPending(null)}
        />
      )}

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/60 backdrop-blur-md py-4 text-center text-slate-400 text-xs border-t border-slate-100">
        Powered by Gemini AI • Professional Parent-Teacher Solutions
      </footer>
    </div>
  );
};

export default App;
