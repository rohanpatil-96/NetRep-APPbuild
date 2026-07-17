import React, { useState } from 'react';
import { User, Scale, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { UserSettings } from '../data/exercises';

interface ProfileOnboardingProps {
  onComplete: (settings: UserSettings) => void;
}

export default function ProfileOnboarding({ onComplete }: ProfileOnboardingProps) {
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [startingWeight, setStartingWeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [disableVibrations, setDisableVibrations] = useState<boolean>(false);
  
  // Custom in-app warning message
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate Age
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 120) {
      setValidationError('Please enter a valid age between 10 and 120 years.');
      return;
    }

    // Validate Height
    const parsedHeight = parseInt(height, 10);
    if (isNaN(parsedHeight) || parsedHeight < 80 || parsedHeight > 250) {
      setValidationError('Please enter a valid height between 80 and 250 cm.');
      return;
    }

    // Validate Gender
    if (!gender) {
      setValidationError('Please select your gender identification.');
      return;
    }

    // Validate Starting Weight
    const parsedStartWeight = parseFloat(startingWeight);
    if (isNaN(parsedStartWeight) || parsedStartWeight < 20 || parsedStartWeight > 500) {
      setValidationError(`Please enter a valid starting weight between 20 and 500 ${weightUnit}.`);
      return;
    }

    // Validate Target Weight
    const parsedTargetWeight = parseFloat(targetWeight);
    if (isNaN(parsedTargetWeight) || parsedTargetWeight < 20 || parsedTargetWeight > 500) {
      setValidationError(`Please enter a valid target weight between 20 and 500 ${weightUnit}.`);
      return;
    }

    // Call callback with clean settings object
    onComplete({
      age: parsedAge,
      height: parsedHeight,
      gender,
      startingWeight: parsedStartWeight,
      targetWeight: parsedTargetWeight,
      weightUnit,
      disableVibrations
    });
  };

  return (
    <div className="bg-scand-card border border-scand-border rounded-3xl p-6 md:p-8 shadow-sm animate-fade-in" id="profile-onboarding-card">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-accent-dim flex items-center justify-center text-accent shrink-0 border border-accent/10">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-display font-black uppercase tracking-wider text-scand-text">Set Up Your Profile</h2>
          <p className="text-sm text-scand-text/75 mt-1 leading-relaxed">
            Please enter your physical stats below to initialize your weight logs and calibrate workout analytics. We do not use demo data by default.
          </p>
        </div>
      </div>

      {/* In-App Custom Warning Pop-up Banner */}
      {validationError && (
        <div className="mb-6 p-4 bg-rose-950/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-500 animate-shake" id="onboarding-validation-error">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-display uppercase tracking-wider font-extrabold">Invalid Profile Entry</h4>
            <p className="text-xs leading-normal opacity-90">{validationError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Preferred Weight Unit Selector */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60">
              Weight Unit System
            </label>
            <div className="flex bg-scand-bg p-1 rounded-xl border border-scand-border">
              <button
                type="button"
                onClick={() => setWeightUnit('kg')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  weightUnit === 'kg'
                    ? 'bg-accent text-scand-bg shadow-xs'
                    : 'text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                Metric System (kg)
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit('lbs')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  weightUnit === 'lbs'
                    ? 'bg-accent text-scand-bg shadow-xs'
                    : 'text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                Imperial System (lbs)
              </button>
            </div>
          </div>

          {/* Age Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60">
              Age (Years)
            </label>
            <input
              type="number"
              min="10"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2.5 bg-scand-bg border border-scand-border rounded-xl text-sm text-scand-text focus:outline-hidden focus:border-accent font-semibold"
              placeholder="e.g. 28"
            />
          </div>

          {/* Height Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60">
              Height (cm)
            </label>
            <input
              type="number"
              min="80"
              max="250"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2.5 bg-scand-bg border border-scand-border rounded-xl text-sm text-scand-text focus:outline-hidden focus:border-accent font-semibold"
              placeholder="e.g. 178"
            />
          </div>

          {/* Gender Select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60">
              Gender Identity
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2.5 bg-scand-bg border border-scand-border rounded-xl text-sm text-scand-text focus:outline-hidden focus:border-accent font-semibold cursor-pointer"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Haptic Vibrations Toggle */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60">
              Tactile Haptics (Vibrations)
            </label>
            <div className="flex bg-scand-bg p-1 rounded-xl border border-scand-border">
              <button
                type="button"
                onClick={() => setDisableVibrations(false)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !disableVibrations
                    ? 'bg-accent text-scand-bg shadow-xs'
                    : 'text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                Enabled
              </button>
              <button
                type="button"
                onClick={() => setDisableVibrations(true)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  disableVibrations
                    ? 'bg-accent text-scand-bg shadow-xs'
                    : 'text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                Disabled
              </button>
            </div>
          </div>

          {/* Starting Weight */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-accent" />
              Starting Weight ({weightUnit})
            </label>
            <input
              type="number"
              step="0.1"
              value={startingWeight}
              onChange={(e) => setStartingWeight(e.target.value)}
              className="w-full px-4 py-2.5 bg-scand-bg border border-scand-border rounded-xl text-sm text-scand-text focus:outline-hidden focus:border-accent font-semibold"
              placeholder={`Current weight in ${weightUnit}`}
            />
          </div>

          {/* Target Weight */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-emerald-500" />
              Target Goal Weight ({weightUnit})
            </label>
            <input
              type="number"
              step="0.1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="w-full px-4 py-2.5 bg-scand-bg border border-scand-border rounded-xl text-sm text-scand-text focus:outline-hidden focus:border-accent font-semibold"
              placeholder={`Goal weight in ${weightUnit}`}
            />
          </div>

        </div>

        {/* Form Submission */}
        <div className="pt-4 border-t border-scand-border flex items-center justify-between">
          <div className="text-[11px] text-scand-text/50 max-w-[60%] leading-tight">
            * By proceeding, your starting weight is automatically initialized in the progress tracking chart.
          </div>
          
          <button
            type="submit"
            className="py-3 px-6 bg-accent hover:bg-accent-hover text-scand-bg rounded-2xl font-display uppercase tracking-widest font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            Create Profile
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
