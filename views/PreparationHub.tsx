
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BookOpen, Sparkles, Terminal, Cpu, Database, Globe, Loader2, ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react';
import { StudentProfile } from '../types';

interface PrepHubProps {
  profile: StudentProfile;
}

const PreparationHub: React.FC<PrepHubProps> = ({ profile }) => {
  const [loading, setLoading] = useState(true);
  const [curatedContent, setCuratedContent] = useState<any>(null);

  useEffect(() => {
    const fetchPrepData = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          Generate a placement preparation roadmap for a student with the following profile:
          Branch: ${profile.branch}
          Skills: ${profile.skills.join(', ')}
          Year: ${profile.year}

          Return a JSON object with:
          1. "hotTopics": Array of 4 trending technical topics for this branch.
          2. "interviewQuestions": Array of 3 specific technical questions for their skills.
          3. "roadmapSteps": Array of 4 logical steps for their next 3 months of prep.
          
          Format the response strictly as JSON.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { 
            responseMimeType: "application/json"
          }
        });

        setCuratedContent(JSON.parse(response.text || '{}'));
      } catch (err) {
        console.error("Prep Hub Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrepData();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-pulse">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
          <Loader2 size={40} className="text-indigo-400 animate-spin" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-white/20">Curating Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <header className="space-y-4">
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
          <Sparkles size={14} className="text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Knowledge Forge</span>
        </div>
        <h1 className="text-6xl font-black font-heading tracking-tighter">Prep <span className="text-white/20">Hub</span></h1>
        <p className="text-white/40 font-medium max-w-2xl">AI-curated resources and technical deep-dives specific to {profile.branch} engineering.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Roadmap */}
        <div className="xl:col-span-2 space-y-10">
          <section className="glass rounded-[48px] p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
              <Globe size={200} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Terminal size={24} />
              </div>
              <h3 className="text-3xl font-bold font-heading">Strategic Roadmap</h3>
            </div>
            
            <div className="space-y-6 relative z-10">
              {curatedContent?.roadmapSteps?.map((step: string, i: number) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                      {i + 1}
                    </div>
                    {i < curatedContent.roadmapSteps.length - 1 && <div className="w-[1px] h-full bg-white/10 mt-2" />}
                  </div>
                  <div className="pb-8">
                    <p className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">{step}</p>
                    <p className="text-xs text-white/40 mt-2 font-medium">Estimated Completion: Week {i * 2 + 2}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-[48px] p-10 bg-gradient-to-br from-cyan-600/10 to-transparent border-cyan-500/20">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Database size={24} />
                </div>
                <h3 className="text-3xl font-bold font-heading">Technical Drill</h3>
             </div>
             <div className="grid grid-cols-1 gap-6">
                {curatedContent?.interviewQuestions?.map((q: string, i: number) => (
                  <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
                        <Lightbulb size={18} />
                      </div>
                      <p className="text-sm font-bold leading-relaxed">{q}</p>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Trending & Insights */}
        <div className="space-y-10">
          <section className="glass rounded-[48px] p-8 border border-white/10 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 px-2">Trending in {profile.branch}</h4>
            <div className="space-y-3">
              {curatedContent?.hotTopics?.map((topic: string, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all group">
                  <span className="text-xs font-bold text-white/60 group-hover:text-white">{topic}</span>
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-[48px] p-8 bg-gradient-to-br from-emerald-600/10 to-transparent border-emerald-500/20 space-y-6 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
               <Cpu size={140} />
            </div>
            <div className="relative z-10 space-y-6">
               <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={28} />
               </div>
               <div>
                 <h4 className="text-xl font-bold font-heading">Placement Readiness</h4>
                 <p className="text-xs text-white/40 mt-2 font-medium leading-relaxed">Your current profile matches 85% of high-growth tech firms in our database.</p>
               </div>
               <button className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors">
                  Take Skill Test
               </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PreparationHub;
