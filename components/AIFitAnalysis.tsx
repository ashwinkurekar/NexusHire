
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, BrainCircuit, Target, Lightbulb, Loader2, ArrowUpRight } from 'lucide-react';
import { StudentProfile, PlacementDrive } from '../types';

interface AIFitAnalysisProps {
  profile: StudentProfile;
  drive: PlacementDrive;
}

const AIFitAnalysis: React.FC<AIFitAnalysisProps> = ({ profile, drive }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const performAnalysis = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Analyze the fit between this student and this placement drive.
        Student: ${profile.name}, Branch: ${profile.branch}, Skills: ${profile.skills.join(', ')}, CGPA: ${profile.cgpa}
        Drive: ${drive.companyName}, Role: ${drive.role}, Req Skills: ${drive.rules.requiredSkills.join(', ')}

        Provide a JSON response with:
        "fitScore": number (0-100),
        "reason": A 2-sentence explanation of the fit,
        "skillGaps": Array of 2 skills the student should learn for this role,
        "strategy": A tip for the interview at ${drive.companyName}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      setAnalysis(JSON.parse(response.text || '{}'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!analysis && !loading) {
    return (
      <button 
        onClick={performAnalysis}
        className="w-full p-6 rounded-3xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-between group hover:scale-[1.02] transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <BrainCircuit size={24} className="text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-black text-sm uppercase tracking-widest text-violet-400">Analyze Professional Fit</h4>
            <p className="text-xs text-white/40 font-medium">Use AI to compare your profile with {drive.companyName}'s needs.</p>
          </div>
        </div>
        <ArrowUpRight size={20} className="text-white/20 group-hover:text-white transition-colors" />
      </button>
    );
  }

  if (loading) {
    return (
      <div className="w-full p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-violet-400 animate-spin" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Crunching Academic Metadata...</p>
      </div>
    );
  }

  return (
    <div className="w-full glass rounded-[40px] p-8 border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-transparent space-y-6 animate-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="text-violet-400" size={20} />
          <h4 className="font-bold font-heading">Fit Analysis</h4>
        </div>
        <div className="text-2xl font-black font-heading text-violet-400">{analysis.fitScore}%</div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-xs text-white/80 leading-relaxed font-medium">{analysis.reason}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1.5">
              <Target size={10} /> Skill Gaps
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.skillGaps.map((s: string) => (
                <span key={s} className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/10">{s}</span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1.5">
              <Lightbulb size={10} /> Prep Tip
            </p>
            <p className="text-[10px] text-white/60 font-medium leading-tight">{analysis.strategy}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFitAnalysis;
