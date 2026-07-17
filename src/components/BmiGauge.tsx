import { useMemo } from 'react';

interface BmiGaugeProps {
  bmi: number;
  isPrivate?: boolean;
}

export default function BmiGauge({ bmi, isPrivate = false }: BmiGaugeProps) {
  // BMI classification
  const classification = useMemo(() => {
    if (bmi <= 0) return { label: 'Enter details', color: 'text-scand-text/60', hex: '#6b7280' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-sky-600 dark:text-sky-400', hex: '#0284c7' };
    if (bmi < 25.0) return { label: 'Normal Weight', color: 'text-accent', hex: 'var(--color-accent, #3f612d)' };
    if (bmi < 30.0) return { label: 'Overweight', color: 'text-amber-600 dark:text-amber-400', hex: '#d97706' };
    return { label: 'Obese', color: 'text-rose-600 dark:text-rose-400', hex: '#e11d48' };
  }, [bmi]);

  // Calculate needle rotation angle based on BMI (clamped between 15 and 45)
  // Angle: -90 degrees (Underweight) to +90 degrees (Obese)
  // Let's map BMI range 15 to 35 to angle range -90 to +90
  const angle = useMemo(() => {
    if (bmi <= 0) return -90;
    const minBmi = 15;
    const maxBmi = 35;
    const clampedBmi = Math.max(minBmi, Math.min(maxBmi, bmi));
    const percentage = (clampedBmi - minBmi) / (maxBmi - minBmi); // 0 to 1
    return -90 + percentage * 180; // -90 to 90 degrees
  }, [bmi]);

  return (
    <div className="flex flex-col items-center bg-scand-card border border-scand-border rounded-3xl p-6 shadow-sm animate-fade-in" id="bmi-gauge">
      <h3 className="text-xs font-display uppercase tracking-widest font-black text-scand-text/60 mb-2">BMI Speedometer</h3>
      
      <div className="relative w-64 h-36 flex items-end justify-center overflow-hidden">
        {/* Speedometer Arc SVG */}
        <svg className="w-full h-full" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" /> {/* Sky blue */}
              <stop offset="35%" stopColor="var(--color-accent, #3f612d)" /> {/* Forest green */}
              <stop offset="70%" stopColor="#f59e0b" /> {/* Amber */}
              <stop offset="100%" stopColor="#f43f5e" /> {/* Rose red */}
            </linearGradient>
          </defs>
          
          {/* Main gauge track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--color-scand-bg, #faf3dd)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Colored gradient track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Center pivot point */}
          <circle cx="100" cy="100" r="6" fill="var(--color-scand-text, #563635)" />
          
          {/* Needle */}
          {!isPrivate ? (
            <g transform={`rotate(${angle} 100 100)`}>
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="30"
                stroke="var(--color-accent, #3f612d)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <polygon points="96,40 100,24 104,40" fill="var(--color-accent, #3f612d)" />
            </g>
          ) : (
            // Funny gimmick: multiple arrows pointing everywhere
            <>
              {[
                { deg: -80, col: '#0284c7' },
                { deg: -55, col: 'var(--color-accent, #3f612d)' },
                { deg: -30, col: '#d97706' },
                { deg: -10, col: '#e11d48' },
                { deg: 15, col: '#0284c7' },
                { deg: 40, col: 'var(--color-accent, #3f612d)' },
                { deg: 65, col: '#d97706' },
                { deg: 85, col: '#e11d48' }
              ].map((n, idx) => (
                <g key={idx} transform={`rotate(${n.deg} 100 100)`} className="opacity-80">
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="30"
                    stroke={n.col}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <polygon points="96.5,40 100,24 103.5,40" fill={n.col} />
                </g>
              ))}
            </>
          )}
        </svg>

        {/* Floating BMI Number in center of arc */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className={`text-3xl font-display font-black text-scand-text tracking-tight transition-all duration-300 ${isPrivate ? 'blur-md select-none' : ''}`}>
            {bmi > 0 ? (isPrivate ? '██.█' : bmi.toFixed(1)) : '--.-'}
          </span>
          <span className={`text-[10px] font-display font-black uppercase tracking-wider ${classification.color} mt-1.5 px-3 py-0.5 rounded-full bg-scand-bg border border-scand-border transition-all duration-300 ${isPrivate ? 'blur-xs select-none font-bold' : ''}`}>
            {isPrivate ? '█████' : classification.label}
          </span>
        </div>
      </div>

      {/* Mini classifications guide */}
      <div className="grid grid-cols-4 gap-2 w-full mt-4 text-[10px] font-semibold text-scand-text/60 text-center border-t border-scand-border pt-4">
        <div>
          <span className="block text-sky-600 dark:text-sky-400">&lt; 18.5</span>
          <span>Under</span>
        </div>
        <div>
          <span className="block text-accent">18.5 - 24.9</span>
          <span>Normal</span>
        </div>
        <div>
          <span className="block text-amber-600 dark:text-amber-400">25 - 29.9</span>
          <span>Over</span>
        </div>
        <div>
          <span className="block text-rose-600 dark:text-rose-400">30+</span>
          <span>Obese</span>
        </div>
      </div>
    </div>
  );
}
