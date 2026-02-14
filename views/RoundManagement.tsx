
import React, { useState } from 'react';
import { Settings, ArrowRight, User, MoreHorizontal, CheckCircle, XCircle, Search, Filter, Layers, LayoutGrid } from 'lucide-react';
import { Application, PlacementDrive, ApplicationStatus } from '../types';
import { STATUS_ORDER } from '../constants';

interface RoundManagementViewProps {
  applications: Application[];
  drives: PlacementDrive[];
  onUpdateStatus: (appId: string, status: ApplicationStatus) => void;
}

const RoundManagementView: React.FC<RoundManagementViewProps> = ({ applications, drives, onUpdateStatus }) => {
  const [selectedDriveId, setSelectedDriveId] = useState<string>(drives[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');

  const filteredApps = applications.filter(app => {
    const isDrive = app.driveId === selectedDriveId;
    const matchesSearch = app.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return isDrive && matchesSearch;
  });

  const getNextStatus = (current: ApplicationStatus) => {
    const idx = STATUS_ORDER.indexOf(current);
    if (idx === -1 || idx === STATUS_ORDER.length - 1) return null;
    return STATUS_ORDER[idx + 1];
  };

  const boardColumns = [...STATUS_ORDER, ApplicationStatus.REJECTED];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
               <Settings className="text-indigo-400" size={24} />
             </div>
             <h1 className="text-4xl font-black font-heading tracking-tight">Status Pipeline</h1>
          </div>
          <p className="text-white/40 font-medium">Advance candidates through sequential recruitment rounds.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
             <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white'}`}
             >
               <Layers size={18} />
             </button>
             <button 
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'board' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white'}`}
             >
               <LayoutGrid size={18} />
             </button>
          </div>
          <select 
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none font-bold cursor-pointer hover:bg-white/10 transition-colors"
          >
            {drives.map(d => <option key={d.id} value={d.id} className="bg-slate-900">{d.companyName} - {d.role}</option>)}
          </select>
        </div>
      </header>

      {viewMode === 'board' ? (
        <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px] snap-x">
          {boardColumns.map(columnStatus => (
            <div key={columnStatus} className="flex-shrink-0 w-80 flex flex-col gap-6 snap-start">
              <div className="flex items-center justify-between px-4">
                 <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                   columnStatus === ApplicationStatus.SELECTED ? 'text-emerald-400' :
                   columnStatus === ApplicationStatus.REJECTED ? 'text-rose-400' :
                   'text-white/40'
                 }`}>
                   {columnStatus.split('(')[0]}
                 </h4>
                 <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded text-white/30">
                    {filteredApps.filter(a => a.status === columnStatus).length}
                 </span>
              </div>
              
              <div className="flex-1 space-y-4 p-2 rounded-[32px] bg-white/[0.02] border border-white/5">
                {filteredApps.filter(a => a.status === columnStatus).map(app => (
                  <div key={app.id} className="glass rounded-3xl p-6 border border-white/5 hover:border-white/20 transition-all group">
                     <div className="flex items-center gap-3 mb-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          app.status === ApplicationStatus.SELECTED ? 'bg-emerald-500/20 text-emerald-400' :
                          app.status === ApplicationStatus.REJECTED ? 'bg-rose-500/20 text-rose-400' :
                          'bg-white/10'
                        }`}>
                           {app.studentId[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-bold truncate">Candidate {app.studentId}</span>
                     </div>
                     <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-4">Last Sync: {app.lastUpdated}</p>
                     
                     <div className="flex gap-2">
                        {columnStatus !== ApplicationStatus.SELECTED && columnStatus !== ApplicationStatus.REJECTED ? (
                          <>
                            <button 
                              onClick={() => onUpdateStatus(app.id, ApplicationStatus.REJECTED)}
                              className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-rose-500 text-white/30 hover:text-white transition-all border border-white/5"
                            >
                              <XCircle size={14} className="mx-auto" />
                            </button>
                            <button 
                              onClick={() => {
                                const next = getNextStatus(app.status);
                                if (next) onUpdateStatus(app.id, next);
                              }}
                              className="flex-[3] p-3 rounded-xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest hover:scale-[1.05] transition-all"
                            >
                              Advance
                            </button>
                          </>
                        ) : (
                          <div className={`w-full p-3 rounded-xl border text-center text-[9px] font-black uppercase tracking-widest ${
                            columnStatus === ApplicationStatus.SELECTED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {columnStatus}
                          </div>
                        )}
                     </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredApps.map((app) => (
            <div key={app.id} className={`glass rounded-[32px] p-8 border border-white/5 group hover:border-white/20 transition-all duration-500 flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden ${
              app.status === ApplicationStatus.REJECTED ? 'opacity-60' : ''
            }`}>
              {/* Existing List Row UI */}
              <div className="flex items-center gap-6 lg:w-1/4">
                <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-tr flex items-center justify-center text-xl font-black shadow-lg border border-white/10 ${
                  app.status === ApplicationStatus.SELECTED ? 'from-emerald-500 to-teal-600' :
                  app.status === ApplicationStatus.REJECTED ? 'from-rose-500 to-pink-600' :
                  'from-slate-700 to-slate-900'
                }`}>
                   {app.studentId[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-xl leading-tight group-hover:text-cyan-400 transition-colors">Candidate {app.studentId}</h4>
                  <p className="text-[10px] text-white/30 tracking-widest uppercase font-black mt-1">Snapshot: {app.lastUpdated}</p>
                </div>
              </div>

              <div className="flex-1 lg:w-1/2 w-full">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Application Journey</p>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${
                     app.status === ApplicationStatus.SELECTED ? 'text-emerald-400' :
                     app.status === ApplicationStatus.REJECTED ? 'text-rose-400' :
                     'text-cyan-400'
                   }`}>
                     {app.status}
                   </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      app.status === ApplicationStatus.REJECTED ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                    }`}
                    style={{ width: `${app.status === ApplicationStatus.REJECTED ? 100 : (STATUS_ORDER.indexOf(app.status) + 1) / STATUS_ORDER.length * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 lg:w-1/4 justify-end w-full">
                {app.status !== ApplicationStatus.SELECTED && app.status !== ApplicationStatus.REJECTED ? (
                  <>
                    <button 
                      onClick={() => onUpdateStatus(app.id, ApplicationStatus.REJECTED)}
                      className="p-4 rounded-2xl bg-white/5 text-white/30 hover:bg-rose-500 hover:text-white transition-all border border-white/5"
                    >
                      <XCircle size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        const next = getNextStatus(app.status);
                        if (next) onUpdateStatus(app.id, next);
                      }}
                      className="flex-1 px-8 py-4 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.05] active:scale-95 transition-all"
                    >
                      <CheckCircle size={18} /> Advance
                    </button>
                  </>
                ) : (
                  <div className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border font-black uppercase text-[10px] tracking-widest ${
                    app.status === ApplicationStatus.SELECTED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {app.status}
                  </div>
                )}
                <button className="p-4 rounded-2xl bg-white/5 text-white/20 hover:text-white border border-white/5">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoundManagementView;
