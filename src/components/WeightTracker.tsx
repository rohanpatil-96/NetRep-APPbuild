import React, { useState, useMemo, useRef } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { Scale, Plus, Trash2, TrendingDown, Target, Dumbbell, Calendar, Eye, EyeOff } from 'lucide-react';
import BmiGauge from './BmiGauge';
import { WeightLog, UserSettings } from '../data/exercises';

interface WeightTrackerProps {
  settings: UserSettings;
  weightLogs: WeightLog[];
  onAddLog: (weight: number, date: string) => void;
  onDeleteLog: (id: string) => void;
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
}

export default function WeightTracker({
  settings,
  weightLogs,
  onAddLog,
  onDeleteLog,
  onUpdateSettings
}: WeightTrackerProps) {
  const [newWeight, setNewWeight] = useState('');
  const [dateInputVal, setDateInputVal] = useState(() => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d}/${m}/${y}`;
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isPrivate, setIsPrivate] = useState(() => {
    return localStorage.getItem('gym_weight_private') === 'true';
  });
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  const handleTogglePrivate = () => {
    setIsPrivate(prev => {
      const newVal = !prev;
      localStorage.setItem('gym_weight_private', String(newVal));
      return newVal;
    });
  };

  // Calculate current BMI based on latest weight log or starting weight
  const latestWeight = useMemo(() => {
    if (weightLogs.length > 0) {
      // Sort logs by date ascending to get the absolute latest one chronologically
      const sorted = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return sorted[sorted.length - 1].weight;
    }
    return settings.startingWeight || 0;
  }, [weightLogs, settings.startingWeight]);

  const currentBmi = useMemo(() => {
    if (settings.height <= 0 || latestWeight <= 0) return 0;
    
    // Height in meters
    const heightInMeters = settings.height / 100;
    
    // Weight in kg (convert if unit is lbs)
    let weightInKg = latestWeight;
    if (settings.weightUnit === 'lbs') {
      weightInKg = latestWeight * 0.453592;
    }
    
    return weightInKg / (heightInMeters * heightInMeters);
  }, [latestWeight, settings.height, settings.weightUnit]);

  // Calculate weight statistics
  const stats = useMemo(() => {
    const start = settings.startingWeight;
    const target = settings.targetWeight;
    const current = latestWeight;
    
    const isLoss = target <= start;
    const totalGoal = Math.abs(start - target);
    const completed = Math.abs(start - current);
    
    let progressPercent = 0;
    if (totalGoal > 0) {
      // If we are moving in the right direction
      const correctDirection = isLoss ? (current <= start) : (current >= start);
      if (correctDirection) {
        progressPercent = Math.min(100, Math.round((completed / totalGoal) * 100));
      }
    }

    const remaining = Math.abs(current - target);
    const reached = isLoss ? current <= target : current >= target;

    return {
      start,
      target,
      current,
      progressPercent,
      remaining,
      reached,
      isLoss
    };
  }, [settings.startingWeight, settings.targetWeight, latestWeight]);

  // Sort logs chronologically for the chart
  const chartData = useMemo(() => {
    return [...weightLogs]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(log => ({
        ...log,
        // Pretty print date for chart x-axis
        formattedDate: new Date(log.date).toLocaleDateString(undefined, { 
          month: 'short', 
          day: 'numeric',
          timeZone: 'UTC' // Avoid offset issues
        })
      }));
  }, [weightLogs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const parsedWeight = parseFloat(newWeight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setErrorMsg('Please enter a valid positive weight.');
      return;
    }

    if (!dateInputVal) {
      setErrorMsg('Please enter or select a date.');
      return;
    }

    const ddmmyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateInputVal.match(ddmmyyyyRegex);
    if (!match) {
      setErrorMsg('Please enter date in DD/MM/YYYY format.');
      return;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (month < 1 || month > 12) {
      setErrorMsg('Invalid month (01-12).');
      return;
    }
    if (day < 1 || day > 31) {
      setErrorMsg('Invalid day (01-31).');
      return;
    }

    const dateObj = new Date(year, month - 1, day);
    if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
      setErrorMsg('Invalid calendar date.');
      return;
    }

    // Convert to ISO-style YYYY-MM-DD
    const formattedIsoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    onAddLog(parsedWeight, formattedIsoDate);
    setNewWeight('');
  };

  return (
    <div className="space-y-6" id="weight-tracker-tab">
      {/* Target Definition Header Card */}
      <div className="bg-scand-card border border-scand-border rounded-3xl p-6 shadow-sm animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-black uppercase tracking-wider text-scand-text flex items-center gap-2">
              <Scale className="w-5 h-5 text-accent" />
              Body Weight & BMI Journey
              <button
                type="button"
                onClick={handleTogglePrivate}
                className="ml-2 px-2.5 py-1 rounded-xl bg-scand-bg hover:bg-scand-hover text-scand-text border border-scand-border transition-all flex items-center gap-1.5 text-xs font-semibold normal-case tracking-normal cursor-pointer"
                title={isPrivate ? 'Reveal private weight metrics' : 'Hide private weight metrics'}
              >
                {isPrivate ? <EyeOff className="w-3.5 h-3.5 text-accent" /> : <Eye className="w-3.5 h-3.5 text-scand-text/70" />}
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-scand-text/75">{isPrivate ? 'Unhide' : 'Hide'}</span>
              </button>
            </h2>
            <p className="text-sm text-scand-text/75 leading-relaxed">
              Track progress, monitor your Body Mass Index (BMI), and smash your goals.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-scand-text/60 font-extrabold block">Starting Weight</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={settings.startingWeight || ''}
                  onChange={(e) => onUpdateSettings({ startingWeight: parseFloat(e.target.value) || 0 })}
                  className={`w-20 px-2 py-1 text-sm bg-scand-bg border border-scand-border rounded-lg text-center font-bold text-scand-text focus:outline-hidden focus:border-accent transition-all ${
                    isPrivate ? 'blur-md select-none pointer-events-none' : ''
                  }`}
                  placeholder="Start"
                  disabled={isPrivate}
                />
                <span className="text-xs font-semibold text-scand-text/60">{settings.weightUnit}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-scand-text/60 font-extrabold block">Target Weight</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={settings.targetWeight || ''}
                  onChange={(e) => onUpdateSettings({ targetWeight: parseFloat(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 text-sm bg-scand-bg border border-scand-border rounded-lg text-center font-bold text-scand-text focus:outline-hidden focus:border-accent"
                  placeholder="Target"
                />
                <span className="text-xs font-semibold text-scand-text/60">{settings.weightUnit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Loss/Gain Progress Indicator */}
        <div className="mt-6 border-t border-scand-border pt-6">
          <div className="flex justify-between items-center text-sm font-semibold text-scand-text/80 mb-2">
            <span className="flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-scand-text/60" />
              Overall Goal Progress
            </span>
            <span className="text-accent">
              {isPrivate ? (
                <span className="blur-xs select-none font-bold">██%</span>
              ) : (
                `${stats.progressPercent}% Completed`
              )}
            </span>
          </div>
          <div className="w-full bg-scand-bg h-3 rounded-full overflow-hidden border border-scand-border">
            <div 
              className="bg-accent h-full rounded-full transition-all duration-500" 
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-scand-text/60 mt-2">
            <span>
              Start:{' '}
              <span className={`font-semibold ${isPrivate ? 'blur-xs select-none' : ''}`}>
                {isPrivate ? '██.█' : stats.start}
              </span>{' '}
              {settings.weightUnit}
            </span>
            <span className="font-bold text-accent">
              {stats.reached 
                ? 'Goal Achieved! Outstanding!' 
                : (
                  <>
                    <span className={isPrivate ? 'blur-xs select-none' : ''}>
                      {isPrivate ? '██.█' : stats.remaining.toFixed(1)}
                    </span>{' '}
                    {settings.weightUnit} to go
                  </>
                )}
            </span>
            <span>Target: {stats.target} {settings.weightUnit}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Gauges & New Log Entry */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Speedometer Gauges (Left / Top) */}
        <div className="md:col-span-5 space-y-6">
          <BmiGauge bmi={currentBmi} isPrivate={isPrivate} />

          {/* Quick Add Form */}
          <div className="bg-scand-card border border-scand-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-display font-black uppercase tracking-wider text-scand-text mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" />
              Log Current Weight
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-scand-text/75 mb-1">
                    Weight ({settings.weightUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder={`e.g. 78.5`}
                    className="w-full px-3 py-2 text-sm bg-scand-bg border border-scand-border rounded-xl focus:outline-hidden focus:border-accent text-scand-text font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-scand-text/75 mb-1">
                    Date (DD/MM/YYYY)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="DD/MM/YYYY"
                      value={dateInputVal}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Strip non-digits and enforce DD/MM/YYYY typing style
                        const digits = val.replace(/\D/g, '').slice(0, 8);
                        let formatted = '';
                        if (digits.length > 0) {
                          formatted += digits.slice(0, 2);
                        }
                        if (digits.length > 2) {
                          formatted += '/' + digits.slice(2, 4);
                        }
                        if (digits.length > 4) {
                          formatted += '/' + digits.slice(4, 8);
                        }
                        setDateInputVal(formatted);
                      }}
                      className="w-full pl-3 pr-10 py-2 text-sm bg-scand-bg border border-scand-border rounded-xl focus:outline-hidden focus:border-accent text-scand-text font-mono font-semibold"
                    />
                    {/* Calendar select trigger */}
                    <div className="absolute right-2.5 flex items-center justify-center p-1 text-scand-text/60 pointer-events-none">
                      <Calendar className="w-4 h-4" />
                    </div>
                    {/* Hidden input type="date" to let user easily select using native date popup picker */}
                    <input
                      type="date"
                      ref={hiddenDateInputRef}
                      onChange={(e) => {
                        const isoVal = e.target.value;
                        if (!isoVal) return;
                        const [y, m, d] = isoVal.split('-');
                        setDateInputVal(`${d}/${m}/${y}`);
                      }}
                      className="absolute right-2 w-7 h-7 opacity-0 cursor-pointer"
                      title="Select date via calendar picker"
                    />
                  </div>
                </div>
              </div>
              
              {errorMsg && (
                <p className="text-xs font-semibold text-rose-500">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-scand-bg rounded-xl text-xs font-display uppercase tracking-widest font-black transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Weight Record
              </button>
            </form>
          </div>
        </div>

        {/* Interactive weight progress chart (Right / Bottom) */}
        <div className="md:col-span-7 bg-scand-card border border-scand-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-1 mb-4">
            <h3 className="text-sm font-display font-black uppercase tracking-wider text-scand-text flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              Weight Loss Journey Chart
            </h3>
            <p className="text-xs text-scand-text/75">
              Visualizes actual logs relative to your starting weight and target weight.
            </p>
          </div>

          <div className="h-64 w-full mt-2">
            {chartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-scand-border rounded-2xl p-6 text-center text-scand-text/60">
                <Dumbbell className="w-8 h-8 stroke-1 text-scand-text/40 mb-2" />
                <p className="text-sm font-semibold text-scand-text/85">No progress data logged yet</p>
                <p className="text-xs mt-1">Add your first weight record to see the progress chart!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-scand-border, rgba(0,0,0,0.08))" vertical={false} />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="var(--color-scand-text, rgba(0,0,0,0.4))" 
                    opacity={0.5}
                    fontSize={10} 
                    fontWeight={600} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    domain={['dataMin - 3', 'dataMax + 3']} 
                    stroke="var(--color-scand-text, rgba(0,0,0,0.4))" 
                    opacity={0.5}
                    fontSize={10} 
                    fontWeight={600} 
                    tickLine={false} 
                    axisLine={false} 
                    hide={isPrivate}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-scand-card, #faf3dd)', 
                      borderRadius: '12px',
                      border: '1px solid var(--color-scand-border, rgba(0,0,0,0.1))',
                      boxShadow: 'none',
                      fontSize: '12px',
                      color: 'var(--color-scand-text, #563635)'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: 'var(--color-accent, #3f612d)' }}
                    formatter={(value: any) => {
                      if (isPrivate) return ['██.█', 'Logged Weight'];
                      return [`${value} ${settings.weightUnit}`, 'Logged Weight'];
                    }}
                  />
                  {/* Reference line for Starting Weight */}
                  {settings.startingWeight > 0 && !isPrivate && (
                    <ReferenceLine 
                      y={settings.startingWeight} 
                      stroke="var(--color-scand-text, rgba(0,0,0,0.25))" 
                      strokeDasharray="4 4"
                      label={{ value: 'Start', fill: 'var(--color-scand-text, rgba(0,0,0,0.4))', fontSize: 10, position: 'right' }} 
                    />
                  )}
                  {/* Reference line for Target Weight */}
                  {settings.targetWeight > 0 && (
                    <ReferenceLine 
                      y={settings.targetWeight} 
                      stroke="var(--color-accent, #3f612d)" 
                      strokeDasharray="4 4" 
                      label={{ value: 'Goal', fill: 'var(--color-accent, #3f612d)', fontSize: 10, position: 'right' }} 
                    />
                  )}
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    name="Logged Weight"
                    stroke="var(--color-accent, #3f612d)" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 1, fill: 'var(--color-scand-bg, #faf3dd)', stroke: 'var(--color-accent, #3f612d)' }} 
                    activeDot={{ r: 6, fill: 'var(--color-accent, #3f612d)', stroke: 'var(--color-scand-bg, #faf3dd)' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Historical Logs List */}
          <div className="mt-6 border-t border-scand-border pt-4 flex-1">
            <h4 className="text-xs font-display uppercase tracking-wider font-extrabold text-accent mb-2">
              Log History ({weightLogs.length})
            </h4>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {[...weightLogs]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((log) => (
                  <div 
                    key={log.id} 
                    className="flex justify-between items-center py-2 px-3 bg-scand-bg/40 rounded-xl hover:bg-scand-hover border border-scand-border transition-all"
                  >
                    <span className="text-xs font-medium text-scand-text/75">
                      {new Date(log.date).toLocaleDateString(undefined, { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        timeZone: 'UTC'
                      })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold text-scand-text transition-all duration-300 ${isPrivate ? 'blur-xs select-none' : ''}`}>
                        {isPrivate ? '██.█' : log.weight} {settings.weightUnit}
                      </span>
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="text-scand-text/50 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              {weightLogs.length === 0 && (
                <p className="text-xs text-scand-text/60 text-center py-4">No weight records tracked yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
