
import React, { useState } from 'react';
import { Search, Filter, MapPin, IndianRupee, Clock, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { calculateEligibility } from '../utils';
import EligibilityDrawer from '../components/EligibilityDrawer';
import { PlacementDrive, StudentProfile, Application } from '../types';

interface PlacementDrivesProps {
  drives: PlacementDrive[];
  studentProfile: StudentProfile;
  applications: Application[];
  onApply: (driveId: string) => void;
}

const PlacementDrives: React.FC<PlacementDrivesProps> = ({ drives, studentProfile, applications, onApply }) => {
  const [search, setSearch] = useState('');
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [eligibleOnly, setEligibleOnly] = useState(false);

  const filteredDrives = drives.filter(d => {
    const matchesSearch = d.companyName.toLowerCase().includes(search.toLowerCase()) || 
                          d.role.toLowerCase().includes(search.toLowerCase());
    const isEligible = calculateEligibility(studentProfile, d).isEligible;
    return matchesSearch && (eligibleOnly ? isEligible : true);
  });

  const handleCheckEligibility = (drive: PlacementDrive) => {
    setSelectedDrive(drive);
    setIsDrawerOpen(true);
  };

  const isApplied = (driveId: string) => applications.some(app => app.driveId === driveId);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-heading tracking-tight">Placement Drives</h1>
          <p className="text-white/40 font-medium">Discover and apply for opportunities that match your profile.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search companies, roles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 w-64 md:w-80 transition-all"
            />
          </div>
          <button 
            onClick={() => setEligibleOnly(!eligibleOnly)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest ${
              eligibleOnly 
              ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' 
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <ShieldCheck size={16} /> {eligibleOnly ? 'Filtered' : 'Eligible Only'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredDrives.map((drive) => {
          const eligibility = calculateEligibility(studentProfile, drive);
          const applied = isApplied(drive.id);

          return (
            <div key={drive.id} className="glass rounded-[40px] overflow-hidden group flex flex-col border border-white/5 hover:border-white/10 transition-all duration-500">
              <div className="p-8 space-y-6 flex-1">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden glass-dark p-2 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <img src={drive.logo} alt={drive.companyName} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                      eligibility.isEligible ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {eligibility.isEligible ? 'Eligible' : 'Not Eligible'}
                    </div>
                    {applied && (
                      <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-tighter border border-indigo-500/20">
                        Application Sent
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-heading mb-1 group-hover:text-cyan-400 transition-colors">{drive.companyName}</h3>
                  <p className="text-sm font-medium text-white/40">{drive.role}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/5 text-[11px] font-bold text-white/60 border border-white/5">
                    <IndianRupee size={12} className="text-emerald-400" />
                    {drive.package}
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/5 text-[11px] font-bold text-white/60 border border-white/5">
                    <MapPin size={12} className="text-indigo-400" />
                    {drive.location}
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white/5 border-t border-white/5">
                <button 
                  onClick={() => handleCheckEligibility(drive)}
                  className={`w-full group/btn relative flex items-center justify-center gap-2 py-4 rounded-[24px] font-bold text-sm transition-all overflow-hidden ${
                    applied 
                    ? 'bg-white/5 border border-white/10 text-white/20 cursor-default'
                    : 'bg-white/5 hover:bg-white text-white hover:text-slate-900 shadow-xl'
                  }`}
                >
                  <span className="relative z-10 uppercase tracking-widest text-[11px]">{applied ? 'Locked' : 'Review & Apply'}</span>
                  {!applied && <ArrowRight size={14} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />}
                  {applied && <Check size={14} className="text-cyan-400" />}
                  {!applied && <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDrive && (
        <EligibilityDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          result={calculateEligibility(studentProfile, selectedDrive)}
          companyName={selectedDrive.companyName}
          drive={selectedDrive}
          onApply={() => {
            onApply(selectedDrive!.id);
            setIsDrawerOpen(false);
          }}
          isApplied={isApplied(selectedDrive.id)}
        />
      )}
    </div>
  );
};

export default PlacementDrives;
