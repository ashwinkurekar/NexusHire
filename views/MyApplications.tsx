
import React from 'react';
import { ApplicationStatus, Application, PlacementDrive } from '../types';
import RoundTracker from '../components/RoundTracker';
import { Calendar, Building2, Briefcase, Inbox } from 'lucide-react';

interface MyApplicationsProps {
  applications: Application[];
  drives: PlacementDrive[];
}

const MyApplications: React.FC<MyApplicationsProps> = ({ applications, drives }) => {
  const myApps = applications.map(app => ({
    ...app,
    drive: drives.find(d => d.id === app.driveId)!
  })).filter(a => a.drive);

  if (myApps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-700">
         <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/10">
           <Inbox size={48} />
         </div>
         <div>
            <h2 className="text-2xl font-bold font-heading">No Applications Yet</h2>
            <p className="text-white/40 mt-2">Explore active placement drives and start your journey.</p>
         </div>
         <button className="px-8 py-3 rounded-2xl bg-white text-slate-900 font-bold text-sm">Browse Drives</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in zoom-in duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl font-black font-heading tracking-tight">Active Applications</h1>
        <p className="text-white/40 font-medium">Track your progress and upcoming interview schedules.</p>
      </header>

      <div className="space-y-8">
        {myApps.map((app, i) => (
          <div key={app.id} className="glass rounded-[40px] p-10 border border-white/5 relative group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 p-8">
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border ${
                  app.status === ApplicationStatus.SELECTED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  app.status === ApplicationStatus.REJECTED ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  {app.status}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-3xl glass-dark p-3 border border-white/10 flex items-center justify-center">
                    <img src={app.drive.logo} alt={app.drive.companyName} className="w-full h-full object-cover rounded-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-heading mb-1">{app.drive.companyName}</h3>
                    <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
                      <Briefcase size={14} /> {app.drive.role}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">
                      <Calendar size={12} /> Applied
                    </div>
                    <p className="text-sm font-bold">{app.appliedDate}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">
                      <Building2 size={12} /> Location
                    </div>
                    <p className="text-sm font-bold truncate">{app.drive.location}</p>
                  </div>
                </div>
              </div>

              <div className="lg:w-2/3 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-12 pt-12 lg:pt-0">
                <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Journey Visualization</p>
                <RoundTracker currentStatus={app.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
