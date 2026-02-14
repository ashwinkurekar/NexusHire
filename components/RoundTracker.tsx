
import React from 'react';
import { Check, Circle } from 'lucide-react';
import { ApplicationStatus } from '../types';
import { STATUS_ORDER } from '../constants';

interface RoundTrackerProps {
  currentStatus: ApplicationStatus;
}

const RoundTracker: React.FC<RoundTrackerProps> = ({ currentStatus }) => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const isRejected = currentStatus === ApplicationStatus.REJECTED;

  return (
    <div className="relative pt-10 pb-4">
      <div className="flex items-center justify-between">
        {STATUS_ORDER.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={status} className="flex flex-col items-center flex-1 group">
              {/* Node */}
              <div className="relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted ? 'bg-cyan-500 shadow-lg shadow-cyan-500/40 text-white' : 
                  isCurrent ? (isRejected ? 'bg-rose-500' : 'bg-violet-600 border-2 border-white/50') : 
                  'bg-white/5 border border-white/10 text-white/20'
                }`}>
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="text-xs font-bold">{index + 1}</span>}
                </div>
                
                {/* Connecting Line */}
                {index < STATUS_ORDER.length - 1 && (
                  <div className="absolute top-1/2 left-full w-full h-[2px] -translate-y-1/2 -z-10">
                    <div className="w-full h-full bg-white/5" />
                    <div className={`absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-1000 ${
                      isCompleted ? 'w-full' : 'w-0'
                    }`} />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className={`mt-4 text-[10px] font-bold uppercase tracking-wider text-center px-1 transition-colors ${
                isCurrent ? (isRejected ? 'text-rose-400' : 'text-cyan-400') : 
                isCompleted ? 'text-white/60' : 'text-white/20'
              }`}>
                {status.split('(')[0].trim()}
              </div>
              
              {isCurrent && !isRejected && (
                <div className="mt-1 w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>
          );
        })}
      </div>
      
      {isRejected && (
         <div className="mt-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
           <p className="text-sm font-medium text-rose-400">Application Status: Rejected during {currentStatus}</p>
         </div>
      )}
    </div>
  );
};

export default RoundTracker;
