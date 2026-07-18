import React, { useState, useRef } from 'react';
import { UserSettings, DayPlan, WeightLog } from '../data/exercises';
import { 
  User, 
  HelpCircle, 
  ArrowLeftRight, 
  Download, 
  Upload, 
  FolderSync, 
  CheckCircle, 
  XCircle, 
  Database 
} from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
  onResetApp: () => void;
  theme: 'dark' | 'light';
  weightLogs: WeightLog[];
  plan: DayPlan[] | null;
  setupDetails: {
    splitType: '4-day' | '5-day' | '6-day';
    location: 'gym' | 'home';
    equipmentPref: 'bodyweight' | 'weights' | 'machines' | 'mix';
    expectedTime: '30 min' | '45 min' | '60 min' | '90 min';
    targetGoal: any;
  };
  hasOnboarded: boolean;
  onImportData: (importedJSON: string) => Promise<boolean>;
}

export default function Settings({ 
  settings, 
  onUpdateSettings, 
  onResetApp,
  theme,
  weightLogs,
  plan,
  setupDetails,
  hasOnboarded,
  onImportData
}: SettingsProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const backupData = {
      version: 1,
      exportDate: new Date().toISOString(),
      theme,
      settings,
      weightLogs,
      plan,
      setupDetails,
      hasOnboarded
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `nextrep_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const success = await onImportData(content);
        if (success) {
          setImportStatus('success');
          setTimeout(() => setImportStatus('idle'), 3000);
        } else {
          setImportStatus('error');
          setTimeout(() => setImportStatus('idle'), 3000);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "application/json" || file.name.endsWith('.json'))) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          const success = await onImportData(content);
          if (success) {
            setImportStatus('success');
            setTimeout(() => setImportStatus('idle'), 3000);
          } else {
            setImportStatus('error');
            setTimeout(() => setImportStatus('idle'), 3000);
          }
        }
      };
      reader.readAsText(file);
    } else {
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  const handleUnitChange = (unit: 'kg' | 'lbs') => {
    if (settings.weightUnit === unit) return;

    // Convert weights dynamically when toggling units so the user's data isn't ruined!
    let updatedStart = settings.startingWeight;
    let updatedTarget = settings.targetWeight;

    if (unit === 'kg') {
      // lbs to kg
      updatedStart = Math.round((settings.startingWeight * 0.45359237) * 10) / 10;
      updatedTarget = Math.round((settings.targetWeight * 0.45359237) * 10) / 10;
    } else {
      // kg to lbs
      updatedStart = Math.round((settings.startingWeight / 0.45359237) * 10) / 10;
      updatedTarget = Math.round((settings.targetWeight / 0.45359237) * 10) / 10;
    }

    onUpdateSettings({
      weightUnit: unit,
      startingWeight: updatedStart,
      targetWeight: updatedTarget
    });
  };

  return (
    <div className="space-y-6" id="settings-tab">
      <div className="bg-scand-card border border-scand-border rounded-3xl p-6 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center text-accent border border-accent/10">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-display font-black uppercase tracking-wider text-scand-text">Profile & Calculator Settings</h2>
            <p className="text-xs text-scand-text/75 mt-1 leading-relaxed">
              Provide your details to calculate precise BMIs, track body weight, and calibrate routines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Age Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60">
              Age (Years)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={settings.age || ''}
              onChange={(e) => onUpdateSettings({ age: parseInt(e.target.value) || 0 })}
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
              min="50"
              max="250"
              value={settings.height || ''}
              onChange={(e) => onUpdateSettings({ height: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-scand-bg border border-scand-border rounded-xl text-sm text-scand-text focus:outline-hidden focus:border-accent font-semibold"
              placeholder="e.g. 175"
            />
          </div>

          {/* Gender Select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60">
              Gender
            </label>
            <select
              value={settings.gender || ''}
              onChange={(e) => onUpdateSettings({ gender: e.target.value })}
              className="w-full px-4 py-2.5 bg-scand-bg border border-scand-border rounded-xl text-sm text-scand-text focus:outline-hidden focus:border-accent font-semibold cursor-pointer"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Preferred Weight Unit */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60">
              Preferred Weight Unit
            </label>
            <div className="flex bg-scand-bg p-1 rounded-xl border border-scand-border">
              <button
                type="button"
                onClick={() => handleUnitChange('kg')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  settings.weightUnit === 'kg'
                    ? 'bg-accent text-scand-bg shadow-xs'
                    : 'text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                Metric (kg)
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange('lbs')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  settings.weightUnit === 'lbs'
                    ? 'bg-accent text-scand-bg shadow-xs'
                    : 'text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                Imperial (lbs)
              </button>
            </div>
          </div>

          {/* Haptic Vibrations Toggle */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display uppercase tracking-widest font-black text-scand-text/60">
              Tactile Haptics (Vibrations)
            </label>
            <div className="flex bg-scand-bg p-1 rounded-xl border border-scand-border">
              <button
                type="button"
                onClick={() => onUpdateSettings({ disableVibrations: false })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !settings.disableVibrations
                    ? 'bg-accent text-scand-bg shadow-xs'
                    : 'text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                Enabled
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ disableVibrations: true })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  settings.disableVibrations
                    ? 'bg-accent text-scand-bg shadow-xs'
                    : 'text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                Disabled
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic calculations breakdown */}
        <div className="mt-6 bg-scand-bg/40 p-4 rounded-2xl border border-scand-border">
          <h3 className="text-xs font-display uppercase tracking-wider font-extrabold text-scand-text/80 flex items-center gap-1.5 mb-2">
            <ArrowLeftRight className="w-3.5 h-3.5 text-accent" />
            Automatic Dynamic Conversions Note
          </h3>
          <p className="text-[11px] text-scand-text/75 leading-relaxed">
            Changing units converts starting and target weights automatically so your progress charts remain mathematically perfect.
            Your BMI calculation utilizes metric standards internally (BMI = kg / m²) and handles standard conversions flawlessly.
          </p>
        </div>
      </div>

      {/* Backup & Portability Section */}
      <div className="bg-scand-card border border-scand-border rounded-3xl p-6 shadow-sm space-y-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center text-accent border border-accent/10">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-display font-black uppercase tracking-wider text-scand-text">Data Backup & Portability</h2>
            <p className="text-xs text-scand-text/75 mt-1 leading-relaxed">
              Export your full settings, training routine, logs, and progress charts as a JSON file to transfer between devices.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Action */}
          <div className="bg-scand-bg/40 border border-scand-border p-4 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-display uppercase tracking-wider font-extrabold text-scand-text">Backup Data</h4>
              <p className="text-[11px] text-scand-text/60 mt-1 leading-relaxed">
                Download a secure snapshot of your current configurations, workout schedules, and recorded body metrics.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-scand-bg hover:bg-accent/90 text-xs font-display uppercase tracking-wider font-extrabold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              Export Backup JSON
            </button>
          </div>

          {/* Import Action (Drag and drop zone) */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-4 rounded-2xl flex flex-col justify-between transition-all ${
              isDragging 
                ? 'border-accent bg-accent/5 scale-[1.01]' 
                : 'border-scand-border bg-scand-bg/40'
            }`}
          >
            <div className="text-center md:text-left">
              <h4 className="text-xs font-display uppercase tracking-wider font-extrabold text-scand-text flex items-center justify-center md:justify-start gap-1.5">
                <Upload className="w-3.5 h-3.5 text-accent" />
                Restore Data
              </h4>
              <p className="text-[11px] text-scand-text/60 mt-1 leading-relaxed">
                Drag and drop your exported backup file here, or click below to select it from your device.
              </p>
            </div>

            <div className="mt-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
              />
              
              {importStatus === 'idle' && (
                <button
                  onClick={handleImportClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-scand-bg border border-scand-border hover:bg-scand-border/50 text-scand-text text-xs font-display uppercase tracking-wider font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  <FolderSync className="w-4 h-4 text-accent" />
                  Import Backup file
                </button>
              )}

              {importStatus === 'success' && (
                <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold rounded-xl animate-bounce">
                  <CheckCircle className="w-4 h-4" />
                  Restore Successful!
                </div>
              )}

              {importStatus === 'error' && (
                <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold rounded-xl">
                  <XCircle className="w-4 h-4" />
                  Invalid Backup File Format
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings & System Actions */}
      <div className="bg-scand-card border border-scand-border rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-display font-black uppercase tracking-wider text-scand-text">Danger Zone</h3>
          <p className="text-xs text-scand-text/60 mt-1 leading-relaxed">
            Once deleted, all local data (current routine, checkmarks, weight progression logs, settings) are wiped from this browser. This cannot be undone.
          </p>
        </div>

        <button
          onClick={onResetApp}
          className="px-4 py-2.5 bg-rose-950/10 hover:bg-rose-950/25 text-rose-500 text-xs font-display uppercase tracking-wider font-extrabold rounded-xl border border-rose-500/15 transition-all cursor-pointer"
        >
          Reset All App Data
        </button>
      </div>

      {/* Fitness Knowledge/FAQ Mini Card */}
      <div className="bg-scand-card border border-scand-border rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-display font-black uppercase tracking-wider text-scand-text mb-3 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-accent" />
          Pro-Tips for Success
        </h3>
        <ul className="space-y-2 text-xs text-scand-text/75 list-disc list-inside">
          <li><strong>Form First:</strong> Rep ranges are general guidelines. Never sacrifice form to hit a target.</li>
          <li><strong>Progressive Overload:</strong> Try adding a single rep or slightly better control over weeks.</li>
          <li><strong>Consistency Over Intensity:</strong> Sticking to your 4, 5, or 6-day split matters far more than single high-intensity days.</li>
        </ul>
      </div>
    </div>
  );
}
