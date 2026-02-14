
import React, { useState } from 'react';
import { PlusCircle, Building2, MapPin, Target, ClipboardList, Briefcase, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { BRANCHES } from '../constants';
import { PlacementDrive } from '../types';

interface CreateDriveViewProps {
  onDriveCreated: (drive: PlacementDrive) => void;
}

const CreateDriveView: React.FC<CreateDriveViewProps> = ({ onDriveCreated }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [formData, setFormData] = useState({
    companyName: 'Stellar Tech',
    role: '',
    package: '',
    location: '',
    deadline: '',
    minCGPA: 7.0,
    maxBacklogs: 0,
    allowedBranches: [] as string[],
    requiredSkills: '',
    minYear: 4
  });

  const generateAiRequirements = async () => {
    if (!jobDescription.trim()) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        As an HR specialist, analyze this job description and suggest eligibility criteria for a campus recruitment drive.
        Job Description: ${jobDescription}

        Return exactly a JSON object with:
        "role": Suggested formal role title,
        "minCGPA": Suggested min CGPA (float between 6.5 and 9.0),
        "allowedBranches": Array of branches from: [CSE, IT, ECE, EEE, Mechanical, Civil, Chemical],
        "requiredSkills": String of 5 key technical skills (comma separated),
        "minYear": Integer (3 or 4)

        Format strictly as JSON.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const suggestions = JSON.parse(response.text || '{}');
      setFormData(prev => ({
        ...prev,
        role: suggestions.role || prev.role,
        minCGPA: suggestions.minCGPA || prev.minCGPA,
        allowedBranches: suggestions.allowedBranches || prev.allowedBranches,
        requiredSkills: suggestions.requiredSkills || prev.requiredSkills,
        minYear: suggestions.minYear || prev.minYear
      }));
    } catch (error) {
      console.error("AI Suggestion Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDrive: PlacementDrive = {
      id: `drive-${Date.now()}`,
      companyName: formData.companyName,
      logo: `https://picsum.photos/seed/${formData.companyName}/200`,
      package: formData.package,
      location: formData.location,
      role: formData.role,
      deadline: formData.deadline,
      rules: {
        minCGPA: formData.minCGPA,
        allowedBranches: formData.allowedBranches,
        maxBacklogs: formData.maxBacklogs,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
        minYear: formData.minYear
      }
    };
    onDriveCreated(newDrive);
  };

  const toggleBranch = (branch: string) => {
    setFormData(prev => ({
      ...prev,
      allowedBranches: prev.allowedBranches.includes(branch)
        ? prev.allowedBranches.filter(b => b !== branch)
        : [...prev.allowedBranches, branch]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-right-8 duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 w-fit">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Drive Architect Active</span>
        </div>
        <h1 className="text-6xl font-black font-heading tracking-tighter">Initiate <span className="text-white/20">Recruitment</span></h1>
        <p className="text-white/40 font-medium max-w-2xl leading-relaxed">Define your requirements or use Nexus Intelligence to generate criteria based on your job description.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* AI Assistant Panel */}
        <div className="xl:col-span-4 space-y-8">
          <section className="glass rounded-[48px] p-8 space-y-6 border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-xl">
                <Wand2 size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold font-heading">AI Requirements Generator</h3>
            </div>
            <p className="text-xs text-white/40 font-medium">Paste your Job Description below and Gemini will suggest the optimal eligibility benchmarks.</p>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. We are looking for a Senior Software Engineer with expertise in React, distributed systems, and a passion for scalable code..."
              className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium resize-none"
            />
            <button 
              onClick={generateAiRequirements}
              disabled={isAiLoading || !jobDescription.trim()}
              className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
            >
              {isAiLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {isAiLoading ? 'Analyzing...' : 'Auto-Generate Rules'}
            </button>
          </section>

          <div className="p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Pro Recruiter Tip</h4>
             <p className="text-xs text-white/40 leading-relaxed italic">"Companies that include at least 2 relevant engineering branches see a 45% higher candidate quality score in tech assessments."</p>
          </div>
        </div>

        {/* Form Panel */}
        <form onSubmit={handleSubmit} className="xl:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Drive Info */}
            <section className="glass rounded-[48px] p-10 space-y-8 border border-white/5">
               <div className="flex items-center gap-3">
                 <Briefcase className="text-cyan-400" size={24} />
                 <h3 className="text-2xl font-bold font-heading">Core Details</h3>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Official Job Role</label>
                    <input required placeholder="Software Development Engineer" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-bold" 
                      value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Package (CTC)</label>
                      <input required placeholder="18 LPA" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none font-bold" 
                        value={formData.package} onChange={e => setFormData({...formData, package: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Application Deadline</label>
                      <input required type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none font-bold text-white/60" 
                        value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Hiring Location</label>
                    <input required placeholder="Remote / Bengaluru" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none font-bold" 
                      value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
               </div>
            </section>

            {/* Rules Info */}
            <section className="glass rounded-[48px] p-10 space-y-8 border border-white/5">
               <div className="flex items-center gap-3">
                 <Target className="text-rose-400" size={24} />
                 <h3 className="text-2xl font-bold font-heading">Benchmarks</h3>
               </div>
               <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Minimum CGPA</label>
                      <span className="text-2xl font-black text-cyan-400">{formData.minCGPA.toFixed(1)}</span>
                    </div>
                    <input type="range" min="6.0" max="10.0" step="0.1" className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-400" 
                      value={formData.minCGPA} onChange={e => setFormData({...formData, minCGPA: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Max Backlogs</label>
                      <span className="text-2xl font-black text-rose-400">{formData.maxBacklogs}</span>
                    </div>
                    <input type="range" min="0" max="5" step="1" className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-500" 
                      value={formData.maxBacklogs} onChange={e => setFormData({...formData, maxBacklogs: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Mandatory Skills</label>
                    <input required placeholder="React, Python, SQL" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none font-bold" 
                      value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})} />
                  </div>
               </div>
            </section>
          </div>

          <section className="glass rounded-[48px] p-10 space-y-8 border border-white/5">
             <h3 className="text-2xl font-bold font-heading">Academic Target Pool</h3>
             <div className="flex flex-wrap gap-3">
                {BRANCHES.map(branch => (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => toggleBranch(branch)}
                    className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                      formData.allowedBranches.includes(branch)
                      ? 'bg-white text-slate-900 border-white shadow-xl scale-105'
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {branch}
                  </button>
                ))}
             </div>
          </section>

          <button 
            type="submit"
            className="w-full py-8 rounded-[40px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 text-white font-black text-xl uppercase tracking-tighter shadow-2xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Launch Placement Drive
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDriveView;
