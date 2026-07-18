import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Dumbbell, 
  Scale, 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Compass, 
  Activity,
  CheckSquare,
  User,
  AlertTriangle,
  Database
} from 'lucide-react';
import { DayPlan, UserSettings, WeightLog, generatePlan, TargetGoal } from './data/exercises';
import Dashboard from './components/Dashboard';
import WeightTracker from './components/WeightTracker';
import Settings from './components/Settings';
import PlanBuilder from './components/PlanBuilder';
import ProfileOnboarding from './components/ProfileOnboarding';
import { Capacitor } from '@capacitor/core';
import { triggerSelectionHaptic, triggerSuccessHaptic } from './lib/haptics';
import { initStorageCache, getStorageItem, setStorageItem, removeStorageItem } from './lib/storage';

const EMPTY_SETTINGS: UserSettings = {
  age: 0,
  height: 0,
  gender: '',
  startingWeight: 0,
  targetWeight: 0,
  weightUnit: 'kg'
};

export default function App() {
  // --- Storage Loading State ---
  const [isStorageReady, setIsStorageReady] = useState(false);

  // --- Persistent States ---
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [settings, setSettings] = useState<UserSettings>(EMPTY_SETTINGS);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [setupDetails, setSetupDetails] = useState<{
    splitType: '4-day' | '5-day' | '6-day';
    location: 'gym' | 'home';
    equipmentPref: 'bodyweight' | 'weights' | 'machines' | 'mix';
    expectedTime: '30 min' | '45 min' | '60 min' | '90 min';
    targetGoal: TargetGoal;
  }>({
    splitType: '4-day',
    location: 'gym',
    equipmentPref: 'mix',
    expectedTime: '60 min',
    targetGoal: 'muscle_build'
  });
  const [activeTab, setActiveTab] = useState<'workout' | 'weight' | 'settings'>('workout');
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

  // --- Debug / Developer Mode (7-tap logo clicks) ---
  const [logoClicks, setLogoClicks] = useState(0);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // --- Async Storage Loading Phase ---
  useEffect(() => {
    const loadSavedData = async () => {
      const keys = [
        'gym_checklist_theme',
        'gym_checklist_settings',
        'gym_checklist_logs',
        'gym_checklist_plan',
        'gym_checklist_setup',
        'gym_checklist_onboarded'
      ];
      // Preload values into synchronous cache so haptics/theme reads work immediately
      await initStorageCache(keys);

      const savedTheme = await getStorageItem('gym_checklist_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }

      const savedSettings = await getStorageItem('gym_checklist_settings');
      if (savedSettings) {
        try { setSettings(JSON.parse(savedSettings)); } catch (e) { /* ignore */ }
      }

      const savedLogs = await getStorageItem('gym_checklist_logs');
      if (savedLogs) {
        try { setWeightLogs(JSON.parse(savedLogs)); } catch (e) { /* ignore */ }
      }

      const savedPlan = await getStorageItem('gym_checklist_plan');
      if (savedPlan) {
        try { setPlan(JSON.parse(savedPlan)); } catch (e) { /* ignore */ }
      }

      const savedSetup = await getStorageItem('gym_checklist_setup');
      if (savedSetup) {
        try { setSetupDetails(JSON.parse(savedSetup)); } catch (e) { /* ignore */ }
      }

      const savedOnboarded = await getStorageItem('gym_checklist_onboarded');
      setHasOnboarded(savedOnboarded === 'true');

      setIsStorageReady(true);
    };

    loadSavedData();
  }, []);


  // --- HTML Theme Effect & Mobile StatusBar Configuration ---
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    if (isStorageReady) {
      setStorageItem('gym_checklist_theme', theme);
    }

    // Apply StatusBar changes if on Native platform
    const updateStatusBar = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const { StatusBar, Style } = await import('@capacitor/status-bar');
          if (theme === 'dark') {
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: '#0b111e' }); // Matches dark mode --color-scand-bg
          } else {
            await StatusBar.setStyle({ style: Style.Light });
            await StatusBar.setBackgroundColor({ color: '#faf3dd' }); // Matches light mode --color-scand-bg
          }
        } catch (e) {
          console.warn('Native status bar adjustment skipped:', e);
        }
      }
    };
    updateStatusBar();
  }, [theme, isStorageReady]);

  // --- Android Physical Back Button Support ---
  useEffect(() => {
    let backButtonListener: Promise<{ remove: () => void }> | null = null;

    if (Capacitor.isNativePlatform()) {
      const initBackButton = async () => {
        try {
          const { App: CapApp } = await import('@capacitor/app');
          backButtonListener = Promise.resolve(
            CapApp.addListener('backButton', () => {
              if (showDebugModal) {
                setShowDebugModal(false);
              } else if (showResetModal) {
                setShowResetModal(false);
              } else if (activeTab !== 'workout') {
                setActiveTab('workout');
              } else {
                CapApp.exitApp();
              }
            })
          );
        } catch (e) {
          console.warn('Native back button listener failed to initialize:', e);
        }
      };
      initBackButton();
    }

    return () => {
      if (backButtonListener) {
        backButtonListener.then(listener => listener.remove());
      }
    };
  }, [showDebugModal, showResetModal, activeTab]);

  // --- Haptics on tab changes ---
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    triggerSelectionHaptic();
  }, [activeTab]);

  // --- Save states on change ---
  useEffect(() => {
    if (isStorageReady) {
      setStorageItem('gym_checklist_settings', JSON.stringify(settings));
    }
  }, [settings, isStorageReady]);

  useEffect(() => {
    if (isStorageReady) {
      setStorageItem('gym_checklist_logs', JSON.stringify(weightLogs));
    }
  }, [weightLogs, isStorageReady]);

  useEffect(() => {
    if (isStorageReady) {
      if (plan) {
        setStorageItem('gym_checklist_plan', JSON.stringify(plan));
      } else {
        removeStorageItem('gym_checklist_plan');
      }
    }
  }, [plan, isStorageReady]);

  useEffect(() => {
    if (isStorageReady) {
      setStorageItem('gym_checklist_setup', JSON.stringify(setupDetails));
    }
  }, [setupDetails, isStorageReady]);

  // --- State Updators ---
  const handlePlanGenerated = (newPlan: DayPlan[], details: typeof setupDetails) => {
    setPlan(newPlan);
    setSetupDetails(details);
    setActiveTab('workout');
    triggerSuccessHaptic();
  };

  const handleUpdateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleAddWeightLog = (weight: number, date: string) => {
    const newLog: WeightLog = {
      id: `l-${Date.now()}`,
      date,
      weight
    };
    setWeightLogs(prev => {
      // Avoid duplicate logs on same date: replace if exists, else append
      const filtered = prev.filter(log => log.date !== date);
      return [...filtered, newLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
    triggerSuccessHaptic();
  };

  const handleDeleteWeightLog = (id: string) => {
    setWeightLogs(prev => prev.filter(log => log.id !== id));
  };

  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    setLogoClicks(prev => {
      const nextClicks = prev + 1;
      if (nextClicks >= 7) {
        setShowDebugModal(true);
        return 0;
      }
      return nextClicks;
    });

    clickTimeoutRef.current = setTimeout(() => {
      setLogoClicks(0);
    }, 3000);
  };

  const handleSeedDemoData = () => {
    const demoSettings: UserSettings = {
      age: 28,
      height: 178,
      gender: 'Male',
      startingWeight: 82.5,
      targetWeight: 75.0,
      weightUnit: 'kg'
    };

    const demoWeightLogs: WeightLog[] = [
      { id: 'dl1', date: '2026-06-09', weight: 82.5 },
      { id: 'dl2', date: '2026-06-16', weight: 81.2 },
      { id: 'dl3', date: '2026-06-23', weight: 79.8 },
      { id: 'dl4', date: '2026-06-30', weight: 78.5 },
      { id: 'dl5', date: '2026-07-07', weight: 77.2 }
    ];

    const demoSetup = {
      splitType: '4-day' as const,
      location: 'gym' as const,
      equipmentPref: 'mix' as const,
      expectedTime: '60 min' as const,
      targetGoal: 'muscle_build' as TargetGoal
    };

    const demoPlan = generatePlan('4-day', 'gym', 'mix', '60 min', 'muscle_build');

    setSettings(demoSettings);
    setWeightLogs(demoWeightLogs);
    setSetupDetails(demoSetup);
    setPlan(demoPlan);
    setHasOnboarded(true);
    setActiveTab('workout');

    setStorageItem('gym_checklist_settings', JSON.stringify(demoSettings));
    setStorageItem('gym_checklist_logs', JSON.stringify(demoWeightLogs));
    setStorageItem('gym_checklist_setup', JSON.stringify(demoSetup));
    setStorageItem('gym_checklist_plan', JSON.stringify(demoPlan));
    setStorageItem('gym_checklist_onboarded', 'true');

    setShowDebugModal(false);
  };

  const handleResetApp = async () => {
    setSettings(EMPTY_SETTINGS);
    setWeightLogs([]);
    setPlan(null);
    setSetupDetails({
      splitType: '4-day',
      location: 'gym',
      equipmentPref: 'mix',
      expectedTime: '60 min',
      targetGoal: 'muscle_build'
    });
    setHasOnboarded(false);
    setActiveTab('workout');
    await removeStorageItem('gym_checklist_settings');
    await removeStorageItem('gym_checklist_logs');
    await removeStorageItem('gym_checklist_plan');
    await removeStorageItem('gym_checklist_setup');
    await removeStorageItem('gym_checklist_onboarded');
    await removeStorageItem('gym_checklist_theme');
    setShowResetModal(false);
  };

  if (!isStorageReady) {
    return (
      <div className="min-h-screen bg-scand-bg flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-scand-bg shadow-sm">
            <Dumbbell className="w-6 h-6 animate-bounce" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-display font-black tracking-widest uppercase text-scand-text">
              NextRep
            </h1>
            <p className="text-[10px] text-scand-text/50 uppercase tracking-wider font-extrabold mt-1">
              Initializing Secure Native Preferences...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scand-bg text-scand-text transition-colors duration-300 font-sans pb-16 md:pb-8">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-scand-bg/90 backdrop-blur-md border-b border-scand-border safe-pt">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer select-none active:scale-98 transition-transform" onClick={handleLogoClick} title="Tap 7 times to seed demo data">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-scand-bg font-extrabold shadow-sm">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-display font-black tracking-widest uppercase leading-none text-scand-text">
                NextRep
              </h1>
              <span className="text-[9px] text-scand-text/60 font-bold uppercase tracking-wider block mt-1">
                Dynamic Routine & Weights Tracker
              </span>
            </div>
          </div>
 
          <div className="flex items-center gap-2">
            {/* Quick stats indicator */}
            {plan && (
              <div className="hidden sm:flex items-center gap-2 bg-scand-card px-3.5 py-1.5 rounded-full border border-scand-border text-xs font-semibold text-scand-text/80">
                <Activity className="w-3.5 h-3.5 text-accent animate-pulse" />
                <span className="font-display text-[10px] uppercase tracking-wider font-extrabold">
                  {setupDetails.splitType === '4-day' ? '4-Day Split' : setupDetails.splitType === '5-day' ? '5-Day Split' : '6-Day Split'}
                </span>
              </div>
            )}
 
            {/* Dark Mode toggle */}
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-full border border-scand-border bg-scand-card hover:bg-scand-hover text-scand-text/80 hover:text-accent transition-colors cursor-pointer"
              title="Toggle color theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>
 
      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {!hasOnboarded ? (
          /* Initial profile onboarding screen */
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2 py-6">
              <div className="inline-flex p-3 rounded-2xl bg-accent-dim text-accent mb-2">
                <User className="w-8 h-8 stroke-1" />
              </div>
              <h1 className="text-2xl font-display font-extrabold tracking-tight text-scand-text">Welcome to NextRep</h1>
              <p className="text-sm text-scand-text/70 max-w-md mx-auto leading-relaxed">
                Initialize your physical profile stats to generate tailored weekly routines and begin tracking weight progress accurately.
              </p>
            </div>
            
            <ProfileOnboarding
              onComplete={(completedSettings) => {
                setSettings(completedSettings);
                
                // Track start weight automatically as initial entry
                const today = new Date();
                const y = today.getFullYear();
                const m = String(today.getMonth() + 1).padStart(2, '0');
                const d = String(today.getDate()).padStart(2, '0');
                const todayIsoStr = `${y}-${m}-${d}`;
                
                const initialLog: WeightLog = {
                  id: `l-init-${Date.now()}`,
                  date: todayIsoStr,
                  weight: completedSettings.startingWeight
                };
                
                setWeightLogs([initialLog]);
                setHasOnboarded(true);
                setStorageItem('gym_checklist_onboarded', 'true');
                setStorageItem('gym_checklist_settings', JSON.stringify(completedSettings));
                setStorageItem('gym_checklist_logs', JSON.stringify([initialLog]));
                triggerSuccessHaptic();
              }}
            />
          </div>
        ) : !plan ? (
          /* Initial setup wizard / Onboarding screen */
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 py-6">
              <div className="inline-flex p-3 rounded-2xl bg-accent-dim text-accent mb-2">
                <Compass className="w-8 h-8 stroke-1" />
              </div>
              <h1 className="text-2xl font-display font-extrabold tracking-tight text-scand-text">Configure Your Gym Routine</h1>
              <p className="text-sm text-scand-text/70 max-w-md mx-auto leading-relaxed">
                Skip the tedious planning phase. Define your target training style, and hit the ground running with an automated split!
              </p>
            </div>
            
            <PlanBuilder 
              onPlanGenerated={handlePlanGenerated} 
              currentSetup={setupDetails}
            />
          </div>
        ) : (
          /* Standard App Dashboard with Tabs Navigation */
          <div className="space-y-6">
            {/* Horizontal Tabs for large screens */}
            <div className="flex border-b border-scand-border">
              <button
                onClick={() => setActiveTab('workout')}
                className={`flex-1 py-3 text-center text-xs font-display uppercase tracking-widest font-extrabold border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'workout'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                Workouts Checklist
              </button>
              <button
                onClick={() => setActiveTab('weight')}
                className={`flex-1 py-3 text-center text-xs font-display uppercase tracking-widest font-extrabold border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'weight'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                <Scale className="w-4 h-4" />
                Weight & BMI Progress
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-3 text-center text-xs font-display uppercase tracking-widest font-extrabold border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-scand-text/60 hover:text-scand-text/90'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                Profile Settings
              </button>
            </div>
 
            {/* Tab Views */}
            <div className="min-h-[50vh]">
              {activeTab === 'workout' && (
                <Dashboard 
                  plan={plan}
                  location={setupDetails.location}
                  equipmentPref={setupDetails.equipmentPref}
                  expectedTime={setupDetails.expectedTime}
                  targetGoal={setupDetails.targetGoal || 'muscle_build'}
                  onUpdatePlan={setPlan}
                  onConfigureNew={() => setPlan(null)} // Re-trigger onboarding/builder
                />
              )}
 
              {activeTab === 'weight' && (
                <WeightTracker
                  settings={settings}
                  weightLogs={weightLogs}
                  onAddLog={handleAddWeightLog}
                  onDeleteLog={handleDeleteWeightLog}
                  onUpdateSettings={handleUpdateSettings}
                />
              )}
 
              {activeTab === 'settings' && (
                <Settings
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onResetApp={() => setShowResetModal(true)}
                />
              )}
            </div>
          </div>
        )}
      </main>
 
      {/* Floating Bottom Nav for Mobile Screens */}
      {plan && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-scand-bg/95 border-t border-scand-border pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] px-4 flex items-center justify-around md:hidden shadow-lg backdrop-blur-md">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              activeTab === 'workout' ? 'text-accent' : 'text-scand-text/60'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-[10px] font-display uppercase tracking-wider font-extrabold">Workouts</span>
          </button>
          <button
            onClick={() => setActiveTab('weight')}
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              activeTab === 'weight' ? 'text-accent' : 'text-scand-text/60'
            }`}
          >
            <Scale className="w-5 h-5" />
            <span className="text-[10px] font-display uppercase tracking-wider font-extrabold">Progress</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              activeTab === 'settings' ? 'text-accent' : 'text-scand-text/60'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-[10px] font-display uppercase tracking-wider font-extrabold">Profile</span>
          </button>
        </div>
      )}

      {/* Admin Developer Tools Modal - Triggered via 7 Taps on logo */}
      {showDebugModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" id="debug-gate-modal">
          <div className="bg-scand-card border border-scand-border rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-display font-black uppercase tracking-wider text-scand-text">NextRep Admin Console</h3>
                <p className="text-xs text-scand-text/70 mt-1 leading-relaxed">
                  You have triggered the hidden developer gate. Seeding demo data will populate your profile with sample stats, weight log metrics, and generate a customized muscle build workout plan.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-950/10 border border-amber-500/10 rounded-2xl flex items-start gap-2.5 text-amber-500/90 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Warning: This will overwrite any profile stats or weight tracking entries you have logged in this browser.</span>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDebugModal(false)}
                className="px-4 py-2 bg-scand-bg hover:bg-scand-hover text-scand-text text-xs font-display uppercase tracking-wider font-extrabold rounded-xl border border-scand-border transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSeedDemoData}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-scand-bg text-xs font-display uppercase tracking-wider font-extrabold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Seed Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom In-App Wipe Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" id="reset-confirm-modal">
          <div className="bg-scand-card border border-scand-border rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-display font-black uppercase tracking-wider text-scand-text">Wipe All App Data?</h3>
                <p className="text-xs text-scand-text/70 mt-1 leading-relaxed">
                  Are you absolutely sure you want to reset NextRep? This will permanently delete your workout routines, profile settings, and all logged weight history.
                </p>
              </div>
            </div>

            <p className="text-xs text-rose-500 font-semibold bg-rose-500/10 p-3 rounded-2xl border border-rose-500/15">
              Warning: This is a permanent system wipe. All input fields will be cleared and the first load page will display.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-scand-bg hover:bg-scand-hover text-scand-text text-xs font-display uppercase tracking-wider font-extrabold rounded-xl border border-scand-border transition-all cursor-pointer"
              >
                Keep My Data
              </button>
              <button
                type="button"
                onClick={handleResetApp}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-display uppercase tracking-wider font-extrabold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Permanently Wipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
