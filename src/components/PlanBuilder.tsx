import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, MapPin, Dumbbell, CalendarRange, Target } from 'lucide-react';
import { generatePlan, DayPlan, TargetGoal } from '../data/exercises';

interface PlanBuilderProps {
  onPlanGenerated: (newPlan: DayPlan[], setupDetails: {
    splitType: '4-day' | '5-day' | '6-day';
    location: 'gym' | 'home';
    equipmentPref: 'bodyweight' | 'weights' | 'machines' | 'mix';
    expectedTime: '30 min' | '45 min' | '60 min' | '90 min';
    targetGoal: TargetGoal;
  }) => void;
  currentSetup?: {
    splitType: '4-day' | '5-day' | '6-day';
    location: 'gym' | 'home';
    equipmentPref: 'bodyweight' | 'weights' | 'machines' | 'mix';
    expectedTime: '30 min' | '45 min' | '60 min' | '90 min';
    targetGoal?: TargetGoal;
  };
}

export default function PlanBuilder({ onPlanGenerated, currentSetup }: PlanBuilderProps) {
  const [splitType, setSplitType] = useState<'4-day' | '5-day' | '6-day'>(currentSetup?.splitType || '4-day');
  const [location, setLocation] = useState<'gym' | 'home'>(currentSetup?.location || 'gym');
  const [equipmentPref, setEquipmentPref] = useState<'bodyweight' | 'weights' | 'machines' | 'mix'>(currentSetup?.equipmentPref || 'mix');
  const [expectedTime, setExpectedTime] = useState<'30 min' | '45 min' | '60 min' | '90 min'>(currentSetup?.expectedTime || '60 min');
  const [targetGoal, setTargetGoal] = useState<TargetGoal>(currentSetup?.targetGoal || 'muscle_build');

  // Keep equipment pref adaptive when location changes
  useEffect(() => {
    if (location === 'home') {
      if (equipmentPref === 'machines') {
        setEquipmentPref('bodyweight'); // default to bodyweight for home
      }
    } else if (location === 'gym') {
      if (equipmentPref === 'bodyweight') {
        setEquipmentPref('mix'); // default to mix for gym
      }
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan = generatePlan(splitType, location, equipmentPref, expectedTime, targetGoal);
    onPlanGenerated(newPlan, { splitType, location, equipmentPref, expectedTime, targetGoal });
  };

  return (
    <div className="bg-scand-card border border-scand-border rounded-3xl p-6 md:p-8 shadow-sm animate-fade-in" id="plan-builder-card">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-accent-dim flex items-center justify-center text-accent shrink-0 border border-accent/10">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-display font-black uppercase tracking-wider text-scand-text">Configure Your Workout Plan</h2>
          <p className="text-sm text-scand-text/75 mt-1 leading-relaxed">
            Answer a few quick questions. We will craft a tailored routine so you can walk straight into your workout without overthinking.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Split Selection */}
        <div className="space-y-3">
          <label className="text-xs font-display uppercase tracking-wider font-extrabold text-scand-text/80 flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-accent" />
            1. Select Your Training Days Split
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: '4-day', label: '4-Day Split', desc: 'Upper / Lower body alternating (ideal for beginners & intermediates)' },
              { id: '5-day', label: '5-Day Split', desc: 'Chest+Shoulders+Triceps / Back+Biceps / Legs / Upper / Lower body routine' },
              { id: '6-day', label: '6-Day Split', desc: 'Push / Pull / Legs repeat (ideal for advanced lifters seeking high volume)' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSplitType(item.id as any)}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  splitType === item.id 
                    ? 'border-accent bg-accent-dim' 
                    : 'border-scand-border bg-scand-bg/40 hover:bg-scand-hover'
                }`}
              >
                <span className="font-bold text-scand-text text-sm">{item.label}</span>
                <span className="text-xs text-scand-text/60 mt-1 leading-normal">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Target Goal Selection */}
        <div className="space-y-3">
          <label className="text-xs font-display uppercase tracking-wider font-extrabold text-scand-text/80 flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            2. Select Your Target Fitness Goal
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { id: 'muscle_build', label: 'Muscle Build', desc: 'Hypertrophy focused volume, controlled movements' },
              { id: 'fat_loss', label: 'Fat Loss', desc: 'Short recovery, higher metabolic density, fast tempo' },
              { id: 'stamina', label: 'Stamina', desc: 'High repetition conditioning, endurance holds' },
              { id: 'strength', label: 'Strength', desc: 'Peak strength power-lifts, lower reps, maximum weight' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTargetGoal(item.id as TargetGoal)}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  targetGoal === item.id 
                    ? 'border-accent bg-accent-dim' 
                    : 'border-scand-border bg-scand-bg/40 hover:bg-scand-hover'
                }`}
              >
                <span className="font-bold text-scand-text text-sm">{item.label}</span>
                <span className="text-[10px] text-scand-text/60 mt-1 leading-normal">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3 & 4: Location and Time Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Selection */}
          <div className="space-y-3">
            <label className="text-xs font-display uppercase tracking-wider font-extrabold text-scand-text/80 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              3. Workout Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'gym', label: 'At the Gym', desc: 'Access to full equipment' },
                { id: 'home', label: 'At Home', desc: 'Minimal/no machines' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLocation(item.id as any)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    location === item.id 
                      ? 'border-accent bg-accent-dim' 
                      : 'border-scand-border bg-scand-bg/40 hover:bg-scand-hover'
                  }`}
                >
                  <span className="font-bold text-scand-text text-sm">{item.label}</span>
                  <span className="text-[10px] text-scand-text/60 mt-1 leading-normal">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Limit Selection */}
          <div className="space-y-3">
            <label className="text-xs font-display uppercase tracking-wider font-extrabold text-scand-text/80 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              4. Expected Gym/Session Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['30 min', '45 min', '60 min', '90 min'] as any[]).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setExpectedTime(time)}
                  className={`flex flex-col items-center justify-center py-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    expectedTime === time 
                      ? 'border-accent bg-accent-dim' 
                      : 'border-scand-border bg-scand-bg/40 hover:bg-scand-hover'
                  }`}
                >
                  <span className="font-bold text-scand-text text-sm">{time.split(' ')[0]}</span>
                  <span className="text-[9px] text-scand-text/60 mt-0.5 uppercase tracking-wide font-extrabold">Mins</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 5: Equipment preference (Depends on Location) */}
        <div className="space-y-3">
          <label className="text-xs font-display uppercase tracking-wider font-extrabold text-scand-text/80 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-accent" />
            5. Choose Equipment Style Preference
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {location === 'home' ? (
              // Home Options
              [
                { id: 'bodyweight', label: 'Bodyweight Only', desc: 'No equipment needed. Uses pure leverage and callisthenics.' },
                { id: 'weights', label: 'Dumbbells & Bands', desc: 'Uses dumbbells, bands, or kettlebells to load the muscle.' },
                { id: 'mix', label: 'Mixed Styles', desc: 'Integrates both bodyweight and free-weight movements.' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEquipmentPref(item.id as any)}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    equipmentPref === item.id 
                      ? 'border-accent bg-accent-dim' 
                      : 'border-scand-border bg-scand-bg/40 hover:bg-scand-hover'
                  }`}
                >
                  <span className="font-bold text-scand-text text-sm">{item.label}</span>
                  <span className="text-xs text-scand-text/60 mt-1 leading-normal">{item.desc}</span>
                </button>
              ))
            ) : (
              // Gym Options
              [
                { id: 'weights', label: 'Free Weights focus', desc: 'Emphasizes barbells, dumbbells, and compound lifting.' },
                { id: 'machines', label: 'Machines & Cables', desc: 'Uses isolated selectorized pin-machines and pulleys.' },
                { id: 'mix', label: 'Balanced Mix', desc: 'Combines free weights, machines, and cables for max growth.' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEquipmentPref(item.id as any)}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    equipmentPref === item.id 
                      ? 'border-accent bg-accent-dim' 
                      : 'border-scand-border bg-scand-bg/40 hover:bg-scand-hover'
                  }`}
                >
                  <span className="font-bold text-scand-text text-sm">{item.label}</span>
                  <span className="text-xs text-scand-text/60 mt-1 leading-normal">{item.desc}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-5 border-t border-scand-border flex items-center justify-between gap-4">
          <div className="text-xs text-scand-text/60 hidden sm:block leading-normal">
            Will generate a custom {splitType === '4-day' ? '4-day' : splitType === '5-day' ? '5-day' : '6-day'} {targetGoal.replace('_', ' ')} plan for {location === 'gym' ? 'the Gym' : 'Home'} using{' '}
            {equipmentPref === 'mix' ? 'balanced' : equipmentPref} style.
          </div>
          
          <button
            type="submit"
            className="w-full sm:w-auto ml-auto py-3.5 px-8 bg-accent hover:bg-accent-hover text-scand-bg rounded-2xl font-display uppercase tracking-widest font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Generate Workout Plan
          </button>
        </div>
      </form>
    </div>
  );
}
