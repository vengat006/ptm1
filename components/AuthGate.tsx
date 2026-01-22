
import React, { useState } from 'react';
import { TranslationSet } from '../types';

interface AuthGateProps {
  expectedPassword: string;
  onSuccess: () => void;
  onCancel: () => void;
  translations: TranslationSet;
}

const AuthGate: React.FC<AuthGateProps> = ({ expectedPassword, onSuccess, onCancel, translations }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === expectedPassword) {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full transition-transform ${error ? 'animate-shake' : ''}`}>
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        
        <h2 className="text-xl font-bold text-center text-slate-800 mb-2">{translations.enterPassword}</h2>
        <p className="text-slate-500 text-sm text-center mb-6">{translations.subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'} focus:ring-2 focus:ring-indigo-200 outline-none transition text-center text-xl tracking-widest`}
            autoFocus
          />
          {error && <p className="text-red-500 text-xs text-center font-bold">{translations.accessDenied}</p>}
          
          <div className="flex flex-col gap-2">
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-200"
            >
              {translations.submit}
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full text-slate-400 hover:text-slate-600 font-medium py-2 transition"
            >
              {translations.cancel}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default AuthGate;
