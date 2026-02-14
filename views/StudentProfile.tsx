
import React, { useState } from 'react';
import { UserCircle, Save, Award, BookOpen, Layers, Plus, X, Upload, FileText, CheckCircle } from 'lucide-react';
import { StudentProfile } from '../types';
import { BRANCHES } from '../constants';

interface StudentProfileProps {
  profile: StudentProfile;
  onUpdate: (profile: StudentProfile) => void;
}

const StudentProfileView: React.FC<StudentProfileProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = () => {
    onUpdate(formData);
    alert('Academic snapshot synced successfully!');
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert("Resume uploaded and parsed successfully! Skills suggested based on resume: Node.js, AWS, Kubernetes.");
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-cyan-500 via-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20 group relative overflow-hidden">
            <UserCircle size={48} className="text-white relative z-10" />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="text-5xl font-black font-heading tracking-tighter">Profile <span className="text-white/20">Studio</span></h1>
            <p className="text-white/40 font-medium">Verified student identity & academic credentials.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-3 px-10 py-5 rounded-3xl bg-white text-slate-900 font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/5"
        >
          <Save size={20} /> Sync Snapshot
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          {/* Basic Info */}
          <section className="glass rounded-[48px] p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
                 Identity Verified
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400">
                  <Award size={20} />
               </div>
               <h3 className="text-2xl font-bold font-heading">Core Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Legal Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Roll Number / UID</label>
                <input 
                  type="text" 
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Department / Branch</label>
                <select 
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold"
                >
                  {BRANCHES.map(b => <option key={b} value={b} className="bg-slate-900">{b}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Current Academic Year</label>
                <input 
                  type="number" 
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold"
                />
              </div>
            </div>
          </section>

          {/* Academics Slider */}
          <section className="glass rounded-[48px] p-10 space-y-10 border border-white/10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-violet-400">
                  <BookOpen size={20} />
               </div>
               <h3 className="text-2xl font-bold font-heading">Performance Metrics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Aggregate CGPA</label>
                  <span className="text-4xl font-black font-heading text-cyan-400">{formData.cgpa.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="0.01"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
                  <span>0.00</span>
                  <span>Average: 7.50</span>
                  <span>10.00</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Active Backlogs</label>
                  <span className={`text-4xl font-black font-heading ${formData.backlogs > 0 ? 'text-rose-500' : 'text-emerald-400'}`}>{formData.backlogs}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  value={formData.backlogs}
                  onChange={(e) => setFormData({ ...formData, backlogs: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
                  <span>Pristine</span>
                  <span>Warning Threshold: 2</span>
                  <span>Critical: 5+</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* Resume Upload */}
          <section className="glass rounded-[48px] p-8 border border-white/10 bg-gradient-to-br from-indigo-500/5 to-transparent">
             <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto border border-indigo-500/20 text-indigo-400">
                   <Upload size={24} />
                </div>
                <div>
                   <h4 className="text-xl font-bold font-heading">Digital Resume</h4>
                   <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-2 font-black">ATS Optimized PDF Only</p>
                </div>
                
                <div 
                  onClick={simulateUpload}
                  className={`border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer group flex flex-col items-center justify-center gap-4 ${
                    isUploading ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                   {isUploading ? (
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-bold text-cyan-400">Parsing...</p>
                     </div>
                   ) : (
                     <>
                        <FileText size={32} className="text-white/20 group-hover:text-white/60 transition-colors" />
                        <p className="text-xs font-medium text-white/40">Drop PDF here or click to browse</p>
                     </>
                   )}
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                   <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                   <p className="text-[10px] text-white/60 leading-relaxed font-medium">NexusHire AI automatically extracts skills from your resume to boost matching.</p>
                </div>
             </div>
          </section>

          {/* Skill Matrix */}
          <section className="glass rounded-[48px] p-8 space-y-6">
            <div className="flex items-center gap-4">
               <Layers className="text-amber-400" size={18} />
               <h3 className="text-lg font-bold font-heading">Expertise Cloud</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.skills.map(skill => (
                <div key={skill} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all shadow-inner">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{skill}</span>
                  <button 
                    onClick={() => removeSkill(skill)}
                    className="text-white/20 hover:text-rose-400 transition-colors p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={addSkill} className="relative mt-4">
              <input 
                type="text"
                placeholder="Declare new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full bg-white/5 border border-dashed border-white/20 rounded-[20px] px-6 py-4 text-xs font-bold focus:outline-none focus:border-cyan-500 transition-all"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 hover:scale-110 transition-transform">
                <Plus size={20} />
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;
