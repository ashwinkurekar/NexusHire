
import React from 'react';

interface EligibilityMeterProps {
  score: number;
  size?: number;
}

const EligibilityMeter: React.FC<EligibilityMeterProps> = ({ score, size = 120 }) => {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 100) return 'stroke-cyan-400';
    if (s >= 60) return 'stroke-amber-400';
    return 'stroke-rose-500';
  };

  const getGlow = (s: number) => {
    if (s >= 100) return 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]';
    if (s >= 60) return 'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]';
    return 'drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]';
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={size / 15}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={size / 12}
          className={`${getColor(score)} transition-all duration-1000 ease-out ${getGlow(score)}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-heading">{Math.round(score)}%</span>
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Match</span>
      </div>
    </div>
  );
};

export default EligibilityMeter;
