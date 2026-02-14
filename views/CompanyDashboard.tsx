
import React from 'react';
import { Users, FileCheck, Target, Zap, TrendingUp, ArrowUpRight, Activity, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PlacementDrive, Application } from '../types';

interface CompanyDashboardProps {
  drives: PlacementDrive[];
  applications: Application[];
}

const COLORS = ['#22d3ee', '#818cf8', '#a78bfa', '#fb7185', '#fbbf24'];

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ drives, applications }) => {
  const chartData = [
    { name: 'CSE', apps: 450 },
    { name: 'IT', apps: 320 },
    { name: 'ECE', apps: 210 },
    { name: 'EEE', apps: 150 },
    { name: 'Mech', apps: 80 },
  ];

  const sortedApps = [...applications].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-heading tracking-tight">Recruitment Hub</h1>
          <p className="text-white/40 font-medium">Tracking company-wide campus hiring performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold text-sm hover:bg-white/10 transition-all">
            <Clock size={18} /> History
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all">
            <Zap size={18} /> Generate Report
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Drives', value: drives.length.toString(), change: '+2', icon: Zap, color: 'cyan' },
          { label: 'Total Applicants', value: applications.length.toString(), change: '+12%', icon: Users, color: 'indigo' },
          { label: 'Shortlisted', value: applications.filter(a => a.status !== 'Applied' && a.status !== 'Rejected').length.toString(), change: '+5%', icon: Target, color: 'emerald' },
          { label: 'Success Rate', value: '75%', change: 'Target', icon: TrendingUp, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-${stat.color}-500/20 to-transparent flex items-center justify-center text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded bg-white/5 text-${stat.color}-400`}>{stat.change}</span>
            </div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-bold font-heading">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass rounded-[40px] p-8">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold font-heading">Applicant Distribution</h3>
             <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Technology</span>
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Engineering</span>
             </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }} 
                  contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#ffffff10', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} 
                />
                <Bar dataKey="apps" radius={[10, 10, 0, 0]} barSize={40}>
                   {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="glass rounded-[40px] p-8 flex flex-col flex-1 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold font-heading flex items-center gap-2">
                <Activity size={20} className="text-cyan-400" /> Live Feed
              </h3>
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            </div>
            <div className="space-y-6 flex-1">
               {sortedApps.slice(0, 4).map((app, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 flex items-center justify-center font-bold text-xs">
                     {app.studentId.toUpperCase()}
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold truncate">Candidate {app.studentId}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-cyan-400 font-black uppercase tracking-widest">{app.status}</span>
                        <span className="text-[9px] text-white/20">• {app.lastUpdated}</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <ArrowUpRight size={14} className="text-white/20 ml-auto group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                   </div>
                 </div>
               ))}
               {sortedApps.length === 0 && (
                 <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-20">
                   <Activity size={32} className="mb-4" />
                   <p className="text-sm font-bold">Waiting for activity...</p>
                 </div>
               )}
            </div>
            <button className="mt-8 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
              Launch Pipeline Studio
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
