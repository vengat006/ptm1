
import React from 'react';
import { MeetingActivity, TranslationSet } from '../types';

interface ActivityLogProps {
  activities: MeetingActivity[];
  translations: TranslationSet;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities, translations }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-3">
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {translations.recentActivityTitle}
      </h2>

      {activities.length === 0 ? (
        <div className="py-12 text-center">
          <svg className="w-16 h-16 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-slate-400 italic">{translations.noActivity}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm uppercase tracking-wider border-b">
                <th className="py-4 font-semibold">{translations.date}</th>
                <th className="py-4 font-semibold">{translations.role}</th>
                <th className="py-4 font-semibold">{translations.duration}</th>
                <th className="py-4 font-semibold">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.sort((a, b) => b.timestamp - a.timestamp).map((act) => (
                <tr key={act.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 text-slate-700">
                    {new Date(act.timestamp).toLocaleString()}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      act.role === 'TEACHER' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {translations[act.role === 'TEACHER' ? 'teacherBtn' : 'parentsBtn']}
                    </span>
                  </td>
                  <td className="py-4 text-slate-600 font-mono">
                    {Math.floor(act.duration / 60)}m {act.duration % 60}s
                  </td>
                  <td className="py-4 text-slate-400 text-xs font-mono">
                    #{act.id.slice(0, 8)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
