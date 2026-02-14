
import React, { useState, useEffect } from 'react';
import { MonitorCheck, Info, RotateCcw } from 'lucide-react';
import { BRANCHES } from '../constants';
import { calculateEligibility } from '../utils';
import { StudentProfile, PlacementDrive, EligibilityResult } from '../types';
import EligibilityMeter from '../components/EligibilityMeter';

interface EligibilitySimulatorProps {
  profile: StudentProfile;
  drives: PlacementDrive[];
}

const EligibilitySimulator: React.FC<EligibilitySimulatorProps> = ({ profile, drives }) => {
  const [simProfile, setSimProfile] = useState<StudentProfile>({ ...profile });
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive>(drives[0]);
  const [result, setResult] = useState<EligibilityResult>(calculateEligibility(simProfile, selectedDrive));

  useEffect(() => {
    setResult(calculateEligibility(simProfile, selectedDrive));
  }, [simProfile, selectedDrive]);

  const resetSim = () => {
    setSimProfile({ ...profile });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
           <MonitorCheck className="text-cyan-400" size={32} />
           <h1 className="text-4xl font-black font-heading tracking-tight">Eligibility Simulator</h1>
        </div>
        <p className="text-white/40 font-medium max-w-2xl">
          Test "what-if" scenarios. Change your metrics temporarily to see how your eligibility for various companies would change. 
          <span className="text-rose-400"> This will not save to your official profile.</span>
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="glass rounded-[40px] p-8">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold font-heading">Modify Profile State</h3>
               <button 
                onClick={resetSim}
                className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors"
               >
                 <RotateCcw size={14} /> Reset to Actual
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-white/60">Simulated CGPA</label>
                    <span className="text-lg font-black text-cyan-400">{simProfile.cgpa.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.1"
                    value={simProfile.cgpa}
                    onChange={(e) => setSimProfile({ ...simProfile, cgpa: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-white/60 block">Academic Branch</label>
                  <select 
                    value={simProfile.branch}
                    onChange={(e) => setSimProfile({ ...simProfile, branch: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none"
                  >
                    {BRANCHES.map(b => <option key={b} value={b} className="bg-slate-900">{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-white/60">Simulated Backlogs</label>
                    <span className="text-lg font-black text-rose-400">{simProfile.backlogs}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="1"
                    value={simProfile.backlogs}
                    onChange={(e) => setSimProfile({ ...simProfile, backlogs: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div className="space-y-3">
                   <label className="text-sm font-bold text-white/60 block">Target Company</label>
                   <div className="grid grid-cols-1 gap-2">
                     {drives.map(drive => (
                       <button
                        key={drive.id}
                        onClick={() => setSelectedDrive(drive)}
                        className={`text-left px-4 py-3 rounded-xl border transition-all ${
                          selectedDrive.id === drive.id 
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                          : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                        }`}
                       >
                         <div className="font-bold text-sm">{drive.companyName}</div>
                         <div className="text-[10px] uppercase tracking-wider opacity-60">{drive.role}</div>
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="glass rounded-[40px] p-8 h-full sticky top-8 flex flex-col items-center justify-center text-center">
            <EligibilityMeter score={result.score} size={200} />
            
            <div className="mt-8 space-y-4 w-full">
              <div>
                <h3 className={`text-2xl font-black font-heading ${result.isEligible ? 'text-cyan-400' : 'text-rose-400'}`}>
                  {result.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                </h3>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Status for {selectedDrive.companyName}</p>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 text-left border border-white/5">
                <p className="text-[11px] font-black uppercase text-white/30 tracking-widest mb-3">Analysis Breakdowns</p>
                <div className="space-y-3">
                   {result.details.map((d, i) => (
                     <div key={i} className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${d.passed ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)]'}`} />
                       <span className={`text-xs font-bold ${d.passed ? 'text-white/80' : 'text-rose-400/80'}`}>{d.label}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilitySimulator;
