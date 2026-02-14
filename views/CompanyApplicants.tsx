
import React, { useState } from 'react';
import { Download, CheckCircle2, XCircle, FileText, ChevronRight, Zap, Filter } from 'lucide-react';
import { PlacementDrive, Application, ApplicationStatus } from '../types';
import { calculateEligibility } from '../utils';
import { DUMMY_STUDENT } from '../constants';
import ApplicantDetailModal from '../components/ApplicantDetailModal';

interface CompanyApplicantsProps {
  drives: PlacementDrive[];
  applications: Application[];
  onUpdateStatus?: (appId: string, status: ApplicationStatus) => void;
}

const CompanyApplicants: React.FC<CompanyApplicantsProps> = ({ drives, applications, onUpdateStatus }) => {
  const [filter, setFilter] = useState<'all' | 'eligible' | 'ineligible'>('all');
  const [selectedDriveId, setSelectedDriveId] = useState(drives[0]?.id || '');
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

  // Mocking applicant evaluation for the list
  const evaluatedApplicants = [
    { ...DUMMY_STUDENT, id: 's1', name: 'Aiden Vance', cgpa: 8.4 },
    { ...DUMMY_STUDENT, id: 's2', name: 'Sarah Chen', cgpa: 9.2 },
    { ...DUMMY_STUDENT, id: 's3', name: 'Marcus Aurelius', cgpa: 7.4 },
    { ...DUMMY_STUDENT, id: 's4', name: 'Diana Prince', cgpa: 8.8 },
    { ...DUMMY_STUDENT, id: 's5', name: 'Barry Allen', cgpa: 6.2 },
  ].map(student => {
    const drive = drives.find(d => d.id === selectedDriveId) || drives[0];
    const eligibility = calculateEligibility(student, drive);
    const application = applications.find(a => a.studentId === student.id && a.driveId === selectedDriveId);
    return { student, eligibility, application, drive };
  });

  const filteredApps = evaluatedApplicants.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'eligible') return app.eligibility.isEligible;
    return !app.eligibility.isEligible;
  });

  const handleAutoShortlist = () => {
    const eligibleOnes = evaluatedApplicants.filter(app => app.eligibility.isEligible && app.application?.status === ApplicationStatus.APPLIED);
    if (eligibleOnes.length === 0) {
      alert("No new eligible candidates to shortlist.");
      return;
    }
    if (onUpdateStatus) {
      eligibleOnes.forEach(app => {
        if (app.application) onUpdateStatus(app.application.id, ApplicationStatus.SHORTLISTED);
      });
      alert(`Auto-shortlisted ${eligibleOnes.length} candidates.`);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-heading tracking-tight">Manage Applicants</h1>
          <p className="text-white/40 font-medium">Review, filter and evaluate candidates in the talent pool.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <select 
              value={selectedDriveId}
              onChange={(e) => setSelectedDriveId(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
           >
             {drives.map(d => <option key={d.id} value={d.id} className="bg-slate-900">{d.companyName} - {d.role}</option>)}
           </select>
           
           <button 
             onClick={handleAutoShortlist}
             className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
           >
             <Zap size={14} /> Auto Shortlist
           </button>
        </div>
      </header>

      <div className="flex items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/5">
        <div className="flex gap-2">
          {(['all', 'eligible', 'ineligible'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="text-[10px] font-black uppercase text-white/20 tracking-widest">
          Showing {filteredApps.length} Candidates
        </div>
      </div>

      <div className="glass rounded-[40px] overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Candidate</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Academic Stats</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Decision Logic</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredApps.map((app, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-cyan-400">
                      {app.student.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold group-hover:text-cyan-400 transition-colors">{app.student.name}</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{app.student.rollNo}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div>
                     <span className="text-sm font-bold">{app.student.cgpa} CGPA</span>
                     <p className="text-[10px] text-white/40">{app.student.branch} • Year {app.student.year}</p>
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    app.eligibility.isEligible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {app.eligibility.isEligible ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {app.eligibility.isEligible ? 'Eligible' : 'Ineligible'}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="max-w-xs">
                    <p className="text-[10px] text-white/60 leading-relaxed italic line-clamp-2">
                      {app.eligibility.isEligible 
                        ? `Meets all benchmarks with a match score of ${app.eligibility.score}%`
                        : app.eligibility.details.find(d => !d.passed)?.message}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 justify-end">
                    <button 
                      onClick={() => setSelectedApplicant(app)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white border border-white/5" 
                      title="View Detailed Profile"
                    >
                      <FileText size={16} />
                    </button>
                    <button className="p-3 bg-white/5 hover:bg-cyan-500/20 rounded-xl transition-all text-white/40 hover:text-cyan-400 border border-white/5">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApplicant && (
        <ApplicantDetailModal 
          isOpen={!!selectedApplicant} 
          onClose={() => setSelectedApplicant(null)}
          student={selectedApplicant.student}
          eligibility={selectedApplicant.eligibility}
          drive={selectedApplicant.drive}
        />
      )}
    </div>
  );
};

export default CompanyApplicants;
