
import React from 'react';
// Added XCircle to imports
import { X, User, MapPin, GraduationCap, Award, CheckCircle2, AlertCircle, FileText, ExternalLink, Mail, Phone, XCircle } from 'lucide-react';
import { StudentProfile, EligibilityResult, PlacementDrive } from '../types';

interface ApplicantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  eligibility: EligibilityResult;
  drive: PlacementDrive;
}

const ApplicantDetailModal: React.FC<ApplicantDetailModalProps> = ({ isOpen, onClose, student, eligibility, drive }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="w-full max-w-5xl glass rounded-[48px] border border-white/10 shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-2xl font-black shadow-xl">
              {student.name[0]}
            </div>
            <div>
              <h2 className="text-3xl font-black font-heading tracking-tight">{student.name}</h2>
              <p className="text-xs text-white/40 font-black uppercase tracking-[0.2em]">{student.branch} • {student.rollNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Info */}
          <div className="lg:col-span-7 space-y-10">
            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 px-2">Academic Profile</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: 'Aggregate CGPA', value: student.cgpa.toFixed(2), icon: GraduationCap, color: 'text-cyan-400' },
                  { label: 'Active Backlogs', value: student.backlogs, icon: AlertCircle, color: student.backlogs > 0 ? 'text-rose-400' : 'text-emerald-400' },
                  { label: 'Degree Year', value: `Year ${student.year}`, icon: Award, color: 'text-indigo-400' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5">
                    <stat.icon size={20} className={`${stat.color} mb-4`} />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 px-2">Skills & Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {student.skills.map(skill => (
                  <span key={skill} className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-tight">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold font-heading flex items-center gap-3">
                   <FileText className="text-indigo-400" /> Digital Artifacts
                 </h3>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
                   Open Portfolio <ExternalLink size={12} />
                 </button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all border border-white/5">
                    <span className="text-sm font-medium">Placement_Resume.pdf</span>
                    <FileText size={16} className="text-white/20 group-hover:text-white" />
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all border border-white/5">
                    <span className="text-sm font-medium">Certificates.zip</span>
                    <FileText size={16} className="text-white/20 group-hover:text-white" />
                 </div>
               </div>
            </section>
          </div>

          {/* Right: Explainability */}
          <div className="lg:col-span-5 space-y-10">
            <section className="p-8 rounded-[40px] bg-white/[0.03] border border-white/5 space-y-8">
              <div className="text-center space-y-4">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center border-4 ${eligibility.isEligible ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'}`}>
                   {eligibility.isEligible ? <CheckCircle2 size={40} className="text-emerald-400" /> : <XCircle size={40} className="text-rose-400" />}
                </div>
                <div>
                  <h4 className="text-2xl font-bold font-heading">Decision Engine</h4>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mt-1">Rule-Based Analysis</p>
                </div>
              </div>

              <div className="space-y-4">
                {eligibility.details.map((detail, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${detail.passed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                    <div className="mt-0.5">
                       {detail.passed ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-rose-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase tracking-widest text-white/60">{detail.label}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${detail.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                           {detail.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed italic">{detail.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-3">Recruiter Decision Tool</p>
                <div className="flex gap-3">
                   <button className="flex-1 py-3 rounded-xl bg-rose-500/20 text-rose-400 font-bold text-xs hover:bg-rose-500 hover:text-white transition-all">Reject</button>
                   <button className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all">Shortlist</button>
                </div>
              </div>
            </section>

            <section className="space-y-6 p-2">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 px-2">Direct Contact</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors cursor-pointer group">
                     <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-cyan-500/20">
                        <Mail size={16} />
                     </div>
                     <span className="text-sm font-medium">{student.name.toLowerCase().replace(' ', '.')}@univ.edu</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors cursor-pointer group">
                     <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-indigo-500/20">
                        <Phone size={16} />
                     </div>
                     <span className="text-sm font-medium">+91 98765-43210</span>
                  </div>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailModal;
