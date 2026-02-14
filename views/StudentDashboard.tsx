
import React, { useState } from 'react';
// Fixed: Added missing 'Bot' import from 'lucide-react'
import { GraduationCap, Briefcase, FileCheck, Target, ExternalLink, Sparkles, Clock, MapPin, MessageSquare, X, Bot } from 'lucide-react';
import { StudentProfile, Application } from '../types';
import AICareerAdvisor from '../components/AICareerAdvisor';

interface StudentDashboardProps {
  profile: StudentProfile;
  applications: Application[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ profile, applications }) => {
  const [showAdvisor, setShowAdvisor] = useState(false);
  const appliedCount = applications.length;
  const shortlistedCount = applications.filter(a => a.status !== 'Applied' && a.status !== 'Rejected').length;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit">
             <Sparkles size={14} className="text-cyan-400" />
             <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Career Pulse Active</span>
          </div>
          <h1 className="text-6xl font-black font-heading tracking-tighter">Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500">Overview</span></h1>
          <p className="text-white/40 font-medium max-w-lg leading-relaxed">System-wide performance tracking for {profile.name}. Your academic snapshot is 92% complete.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[32px] border border-white/10 backdrop-blur-md">
           <div className="text-right">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Live Ranking</p>
              <p className="text-2xl font-black font-heading text-emerald-400">#42 <span className="text-white/20 text-sm">/ 1200</span></p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Target size={24} className="text-white" />
           </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Academic Index', value: profile.cgpa.toFixed(2), unit: 'CGPA', icon: GraduationCap, color: 'from-cyan-500 to-blue-600' },
          { label: 'Global Opportunities', value: '482', unit: 'DRIVES', icon: Briefcase, color: 'from-violet-600 to-indigo-600' },
          { label: 'Active Pipeline', value: appliedCount.toString(), unit: 'APPLIED', icon: FileCheck, color: 'from-emerald-500 to-teal-600' },
          { label: 'Success Velocity', value: shortlistedCount.toString(), unit: 'OFFERS', icon: Sparkles, color: 'from-orange-500 to-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="glass group rounded-[40px] p-8 border border-white/5 hover:border-white/20 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
               <stat.icon size={80} strokeWidth={1} />
            </div>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${stat.color} flex items-center justify-center mb-8 shadow-2xl shadow-black/20`}>
              <stat.icon size={28} className="text-white" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black font-heading">{stat.value}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.unit}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section className="glass rounded-[48px] overflow-hidden border border-white/5 shadow-2xl">
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div>
                <h2 className="text-2xl font-bold font-heading">Recommended Paths</h2>
                <p className="text-xs text-white/40 font-medium mt-1">AI-driven opportunities based on your skills: {profile.skills.slice(0, 3).join(', ')}</p>
              </div>
              <button className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2 transition-all">
                Explore All <ExternalLink size={14} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              {[
                { company: 'Meta', role: 'Product Architect', loc: 'Menlo Park', pkg: '45 LPA', match: 98, color: 'blue' },
                { company: 'Nvidia', role: 'RTX Engine Intern', loc: 'Santa Clara', pkg: '32 LPA', match: 85, color: 'emerald' },
                { company: 'Coinbase', role: 'Security Ops', loc: 'Remote', pkg: '28 LPA', match: 72, color: 'indigo' },
              ].map((rec, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer relative">
                  <div className="flex items-center gap-8 relative z-10">
                    <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                      <span className="text-2xl font-black text-white/40 group-hover:text-white transition-colors">{rec.company[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-xl group-hover:text-cyan-400 transition-colors tracking-tight">{rec.role}</h4>
                      <div className="flex items-center gap-4 mt-1 text-white/40 font-bold text-xs">
                        <span className="flex items-center gap-1"><Briefcase size={12} /> {rec.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {rec.loc}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <p className="text-xl font-black font-heading text-white group-hover:text-cyan-400 transition-colors">{rec.pkg}</p>
                    <div className="flex items-center justify-end gap-2 mt-2">
                       <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${rec.match}%` }} />
                       </div>
                       <p className="text-[10px] font-black text-cyan-400/80 tracking-widest uppercase">{rec.match}% MATCH</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
          {/* AI Advisor Card / Button */}
          <section className="glass rounded-[48px] p-10 bg-gradient-to-br from-cyan-600/20 to-indigo-600/20 border-cyan-500/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                <Bot size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading">AI Career Coach</h3>
                <p className="text-xs text-white/40 font-medium mt-2 leading-relaxed">Ask Gemini for interview strategies, resume feedback, or career roadmaps tailored to your branch.</p>
              </div>
              <button 
                onClick={() => setShowAdvisor(true)}
                className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors shadow-xl"
              >
                <MessageSquare size={16} /> Open Chat
              </button>
            </div>
          </section>

          <section className="glass rounded-[48px] p-10 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border-indigo-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-5%] left-[-5%] w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold font-heading mb-8 flex items-center gap-3">
                <Clock className="text-indigo-400" /> System Alerts
              </h3>
              <div className="space-y-8">
                {[
                  { title: 'Drive Deadline', msg: 'Meta applications close in 2 days', time: '2h ago', status: 'critical' },
                  { title: 'Resume Parsed', msg: 'Successfully extracted 12 new skills', time: '5h ago', status: 'success' },
                  { title: 'Shortlist Update', msg: 'You advanced to HR round at Stellar', time: '1d ago', status: 'info' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="mt-1.5">
                       <div className={`w-2 h-2 rounded-full ${
                         item.status === 'critical' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                         item.status === 'success' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' :
                         'bg-indigo-400'
                       }`} />
                    </div>
                    <div className="space-y-1">
                       <h5 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{item.title}</h5>
                       <p className="text-xs text-white/40 leading-relaxed font-medium">{item.msg}</p>
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* AI Advisor Modal */}
      {showAdvisor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowAdvisor(false)} />
          <div className="w-full max-w-4xl relative z-10 animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowAdvisor(false)}
              className="absolute -top-12 right-0 p-2 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            >
              Close <X size={20} />
            </button>
            <AICareerAdvisor profile={profile} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
