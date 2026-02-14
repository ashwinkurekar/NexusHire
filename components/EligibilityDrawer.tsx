
import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, Check } from 'lucide-react';
import { EligibilityResult, StudentProfile, PlacementDrive } from '../types';
import EligibilityMeter from './EligibilityMeter';
import AIFitAnalysis from './AIFitAnalysis';
import { DUMMY_STUDENT } from '../constants';

interface EligibilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  result: EligibilityResult;
  companyName: string;
  drive: PlacementDrive;
  onApply?: () => void;
  isApplied?: boolean;
}

const EligibilityDrawer: React.FC<EligibilityDrawerProps> = ({ 
  isOpen, 
  onClose, 
  result, 
  companyName, 
  drive,
  onApply,
  isApplied = false
}) => {
  // We use DUMMY_STUDENT here, in a real app this would be the logged in user
  const profile = DUMMY_STUDENT;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-[#0a0a0f] border-l border-white/10 z-[70] shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div>
              <h3 className="text-2xl font-black font-heading tracking-tight">Intelligence Panel</h3>
              <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">{companyName} Analysis</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-white/40 hover:text-white border border-white/5">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth">
            <div className="flex flex-col items-center py-10 bg-gradient-to-b from-white/5 to-transparent rounded-[40px] border border-white/5 shadow-inner">
              <EligibilityMeter score={result.score} size={180} />
              <div className="mt-8 text-center px-4">
                <h4 className={`text-2xl font-black font-heading ${result.isEligible ? 'text-cyan-400' : 'text-rose-400'}`}>
                  {result.isEligible ? 'Target Identified' : 'Access Restricted'}
                </h4>
                <p className="text-xs text-white/40 font-medium leading-relaxed mt-3">
                  {result.isEligible 
                    ? `Operational benchmarks satisfied. Proceed to application protocol.` 
                    : `Profile mismatch detected. Analyze discrepancies in the telemetry below.`}
                </p>
              </div>
            </div>

            {/* AI Fit Analysis Integration */}
            <AIFitAnalysis profile={profile} drive={drive} />

            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 px-2">Verification Telemetry</h5>
              {result.details.map((detail, idx) => (
                <div key={idx} className={`p-6 rounded-3xl border transition-all duration-300 ${detail.passed ? 'bg-white/5 border-white/5' : 'bg-rose-500/5 border-rose-500/20'}`}>
                  <div className="flex items-start gap-5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border ${detail.passed ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                      {detail.passed ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm">{detail.label}</span>
                        {!detail.passed && <span className="text-[9px] font-black uppercase text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded border border-rose-500/20">Critical Fail</span>}
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed font-medium italic">{detail.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex gap-4">
              <Info size={20} className="text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-1">Career Logic</p>
                <p className="text-[11px] text-white/50 leading-relaxed">System eligibility is non-negotiable but can be improved through re-simulation of academic data.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-white/5 bg-black/60 backdrop-blur-md">
            {isApplied ? (
              <div className="flex items-center justify-center gap-3 py-5 rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-[0.2em] shadow-lg">
                <Check size={18} strokeWidth={3} /> Application Locked
              </div>
            ) : result.isEligible ? (
              <button 
                onClick={onApply}
                className="w-full py-5 rounded-[24px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 font-black text-white text-xs uppercase tracking-[0.2em] shadow-2xl shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Initiate Application
              </button>
            ) : (
              <button disabled className="w-full py-5 rounded-[24px] bg-white/5 border border-white/10 text-white/20 font-black text-xs uppercase tracking-[0.2em] cursor-not-allowed">
                Benchmark Not Met
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EligibilityDrawer;
