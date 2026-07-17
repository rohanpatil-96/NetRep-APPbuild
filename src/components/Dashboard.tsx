import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shuffle, 
  CheckCircle, 
  RefreshCw, 
  Printer, 
  EyeOff, 
  Eye, 
  Dumbbell, 
  Calendar, 
  Clock, 
  MapPin, 
  Info,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Target
} from 'lucide-react';
import { DayPlan, TargetGoal, shuffleAllExercisesInDay, shuffleSingleExercise } from '../data/exercises';
import { triggerLightHaptic, triggerMediumHaptic, triggerSuccessHaptic } from '../lib/haptics';

interface DashboardProps {
  plan: DayPlan[];
  location: 'gym' | 'home';
  equipmentPref: 'bodyweight' | 'weights' | 'machines' | 'mix';
  expectedTime: '30 min' | '45 min' | '60 min' | '90 min';
  targetGoal: TargetGoal;
  onUpdatePlan: (newPlan: DayPlan[]) => void;
  onConfigureNew: () => void;
}

export default function Dashboard({
  plan,
  location,
  equipmentPref,
  expectedTime,
  targetGoal,
  onUpdatePlan,
  onConfigureNew
}: DashboardProps) {
  const [hideCompleted, setHideCompleted] = useState(false);
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(0); // Default open first day

  // Toggle checkbox state of an exercise
  const handleToggleExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedPlan = [...plan];
    const day = { ...updatedPlan[dayIndex] };
    if (day.exercises) {
      const exercises = [...day.exercises];
      const nextDone = !exercises[exerciseIndex].done;
      exercises[exerciseIndex] = {
        ...exercises[exerciseIndex],
        done: nextDone
      };
      day.exercises = exercises;
      updatedPlan[dayIndex] = day;
      onUpdatePlan(updatedPlan);

      if (nextDone) {
        const allDone = exercises.every(e => e.done);
        if (allDone) {
          triggerSuccessHaptic();
        } else {
          triggerLightHaptic();
        }
      } else {
        triggerLightHaptic();
      }
    }
  };

  // Shuffle all exercises for a day
  const handleShuffleDay = (dayIndex: number) => {
    const updatedPlan = [...plan];
    updatedPlan[dayIndex] = shuffleAllExercisesInDay(updatedPlan[dayIndex], location, equipmentPref, targetGoal);
    onUpdatePlan(updatedPlan);
    triggerMediumHaptic();
  };

  // Shuffle a single exercise
  const handleShuffleSingle = (dayIndex: number, exerciseIndex: number) => {
    const updatedPlan = [...plan];
    updatedPlan[dayIndex] = shuffleSingleExercise(updatedPlan[dayIndex], exerciseIndex, location, equipmentPref, targetGoal);
    onUpdatePlan(updatedPlan);
    triggerMediumHaptic();
  };

  // Reset all exercises in current plan
  const handleResetPlan = () => {
    const confirmed = window.confirm('Are you sure you want to reset all checked workouts for this week?');
    if (!confirmed) return;

    const updatedPlan = plan.map(day => {
      if (day.exercises) {
        return {
          ...day,
          exercises: day.exercises.map(ex => ({ ...ex, done: false }))
        };
      }
      return day;
    });
    onUpdatePlan(updatedPlan);
  };

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Current Program Stats Bar */}
      <div className="bg-scand-card text-scand-text rounded-3xl p-6 border border-scand-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm animate-fade-in">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-display font-black uppercase tracking-widest bg-accent-dim text-accent px-2.5 py-1 rounded-full border border-accent/15">
              Active Routine
            </span>
          </div>
          <h2 className="text-xl font-display font-black uppercase tracking-wider text-scand-text">Walk-In ready Workout Checklist</h2>
          <p className="text-xs text-scand-text/75">
            Shuffled and optimized based on your gym environment. Zero friction, just lift.
          </p>
        </div>

        {/* Configurations Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 bg-scand-bg/60 text-scand-text/80 px-3 py-1.5 rounded-xl text-xs font-semibold border border-scand-border">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            {location === 'gym' ? 'Gym' : 'Home'}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-scand-bg/60 text-scand-text/80 px-3 py-1.5 rounded-xl text-xs font-semibold border border-scand-border">
            <Dumbbell className="w-3.5 h-3.5 text-accent" />
            {equipmentPref === 'mix' ? 'Mixed' : equipmentPref === 'weights' ? 'Weights' : equipmentPref === 'machines' ? 'Machines' : 'Bodyweight'}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-scand-bg/60 text-scand-text/80 px-3 py-1.5 rounded-xl text-xs font-semibold border border-scand-border">
            <Clock className="w-3.5 h-3.5 text-accent" />
            {expectedTime}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-accent-dim text-accent px-3 py-1.5 rounded-xl text-xs font-semibold border border-accent/15 capitalize">
            <Target className="w-3.5 h-3.5" />
            {targetGoal.replace('_', ' ')}
          </span>
          <button
            onClick={onConfigureNew}
            className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-scand-bg px-3.5 py-1.5 rounded-xl text-xs font-display uppercase tracking-widest font-black transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reconfigure
          </button>
        </div>
      </div>

      {/* Routine Toolbar Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-scand-card border border-scand-border p-3.5 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-display uppercase tracking-wider font-extrabold bg-scand-bg/50 text-scand-text border border-scand-border transition-all hover:bg-scand-hover hover:text-accent cursor-pointer"
          >
            {hideCompleted ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {hideCompleted ? 'Show Completed' : 'Hide Completed'}
          </button>

          <button
            onClick={handleResetPlan}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-display uppercase tracking-wider font-extrabold bg-scand-bg/50 text-scand-text border border-scand-border transition-all hover:bg-scand-hover hover:text-accent cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Checklist
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-display uppercase tracking-wider font-extrabold bg-scand-bg/50 text-scand-text border border-scand-border transition-all hover:bg-scand-hover hover:text-accent cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          Print / PDF
        </button>
      </div>

      {/* 7 Days Workout List */}
      <div className="space-y-4">
        {plan.map((dayPlan, dayIdx) => {
          const isRest = dayPlan.rest;
          const isExpanded = expandedDayIndex === dayIdx;
          const completedCount = dayPlan.exercises?.filter(e => e.done).length || 0;
          const totalCount = dayPlan.exercises?.length || 0;
          const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          // Organize exercises: uncompleted on top, completed at the bottom automatically
          const sortedExercises = useMemo(() => {
            if (!dayPlan.exercises) return [];
            return [...dayPlan.exercises]
              .map((ex, originalIndex) => ({ ...ex, originalIndex }))
              .sort((a, b) => {
                if (a.done === b.done) return a.originalIndex - b.originalIndex;
                return a.done ? 1 : -1; // completed goes to bottom
              });
          }, [dayPlan.exercises]);

          return (
            <div 
              key={dayPlan.day}
              className={`border rounded-3xl transition-all duration-300 overflow-hidden ${
                isRest 
                  ? 'bg-scand-card/40 border-scand-border' 
                  : isExpanded
                    ? 'bg-scand-card border-accent shadow-sm'
                    : 'bg-scand-card border-scand-border hover:border-scand-text/20 shadow-xs'
              }`}
            >
              {/* Day Header row */}
              <div 
                onClick={() => setExpandedDayIndex(isExpanded ? null : dayIdx)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display font-black uppercase tracking-wider text-accent">
                      {dayPlan.day}
                    </span>
                    <span className={`text-[10px] font-display font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                      isRest 
                        ? 'bg-scand-bg text-scand-text/60 border border-scand-border' 
                        : 'bg-accent-dim text-accent border border-accent/20'
                    }`}>
                      {dayPlan.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold text-scand-text truncate">
                    {dayPlan.title}
                  </h3>
                  <p className="text-xs text-scand-text/75 truncate">
                    {dayPlan.note}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Progress Ring / Text for workout days */}
                  {!isRest && totalCount > 0 && (
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-display uppercase tracking-wider font-extrabold text-scand-text/85">
                        {completedCount} / {totalCount} Done
                      </div>
                      <div className="text-[10px] font-semibold text-scand-text/60">
                        {progressPercent}% completed
                      </div>
                    </div>
                  )}

                  {/* Shuffle Day Button (Only for lifting days) */}
                  {!isRest && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Don't trigger expand/collapse
                        handleShuffleDay(dayIdx);
                      }}
                      className="p-2.5 rounded-xl bg-scand-bg/50 hover:bg-accent-dim border border-scand-border text-scand-text/60 hover:text-accent transition-all cursor-pointer"
                      title="Shuffle all exercises for this day (keeps muscle groups)"
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>
                  )}

                  {/* Expand Chevron */}
                  <ChevronRight 
                    className={`w-5 h-5 text-scand-text/60 transition-transform duration-300 ${
                      isExpanded ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
              </div>

              {/* Day Contents Area */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-scand-border">
                      {isRest ? (
                        <div className="bg-scand-bg/40 p-5 rounded-2xl border border-dashed border-scand-border text-center text-scand-text/80 text-sm">
                          <p className="font-semibold text-scand-text/90">No active gym workouts planned for today.</p>
                          <p className="text-xs mt-1 leading-relaxed text-scand-text/60">
                            Take a relaxing stroll, perform lightweight dynamic stretching, drink water, or indulge in total rest to ensure muscles rebuild effectively.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Mini info banner */}
                          <div className="flex items-center gap-2 text-[11px] text-scand-text/75 bg-scand-bg/30 py-2 px-3.5 rounded-xl border border-scand-border">
                            <Info className="w-3.5 h-3.5 shrink-0 text-accent" />
                            <span>Click checklist items as you finish. Tap the shuffle icon on any exercise to swap it out for a fresh option!</span>
                          </div>

                          {sortedExercises.map((ex) => {
                            const isDone = ex.done;
                            const isHidden = hideCompleted && isDone;

                            if (isHidden) return null;

                            return (
                              <motion.div
                                key={ex.slotId}
                                layoutId={ex.slotId}
                                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                                  isDone
                                    ? 'bg-accent-dim/35 border-accent/20 opacity-75'
                                    : 'bg-scand-bg/40 border-scand-border hover:border-scand-text/20'
                                }`}
                              >
                                <div 
                                  onClick={() => handleToggleExercise(dayIdx, ex.originalIndex)}
                                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                                >
                                  {/* Custom Checkbox circle */}
                                  <div className="shrink-0">
                                    {isDone ? (
                                      <CheckCircle className="w-5 h-5 text-accent fill-accent-dim" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-scand-text/20 hover:border-accent transition-colors" />
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <span className={`block font-bold text-sm text-scand-text ${
                                      isDone ? 'line-through text-scand-text/40' : ''
                                    }`}>
                                      {ex.name}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[9px] font-display uppercase tracking-widest font-black text-accent bg-accent-dim px-2 py-0.5 rounded border border-accent/15">
                                        {ex.muscle}
                                      </span>
                                      <span className="text-[11px] text-scand-text/60">
                                        {ex.suggestedReps}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Shuffle Single Exercise Button */}
                                {!isDone && (
                                  <button
                                    onClick={() => handleShuffleSingle(dayIdx, ex.originalIndex)}
                                    className="p-2 rounded-lg text-scand-text/60 hover:text-accent hover:bg-scand-bg transition-colors cursor-pointer"
                                    title="Swap this exercise (keeps target muscle)"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-center text-scand-text/60 pt-4 leading-normal">
        All generated target ranges default to proven scientific ranges. Shuffle exercises dynamically when machines are full. Keep lifting clean!
      </p>
    </div>
  );
}
