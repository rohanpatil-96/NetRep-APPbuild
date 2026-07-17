export interface Exercise {
  id: string;
  name: string;
  muscle: string; // "Chest" | "Back" | "Shoulders" | "Quads" | "Hamstrings" | "Biceps" | "Triceps" | "Abs" | "Calves"
  equipment: 'machine' | 'weights' | 'bodyweight';
  location: 'gym' | 'home'; // home can also be done in gym, but home lacks gym machines
  category: 'compound' | 'isolation';
  suggestedReps: string;
  isFoundational?: boolean;
}

export interface DayPlan {
  day: string;
  title: string;
  note: string;
  badge: 'Workout' | 'Recovery';
  rest?: boolean;
  exercises?: {
    id: string;
    name: string;
    muscle: string;
    suggestedReps: string;
    done: boolean;
    slotId: string; // to track target slot for shuffling
  }[];
}

export interface UserSettings {
  age: number;
  height: number; // in cm
  gender: string;
  startingWeight: number; // in kg
  targetWeight: number; // in kg
  weightUnit: 'kg' | 'lbs';
  disableVibrations?: boolean;
}

export interface WeightLog {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
}

export const EXERCISE_DATABASE: Exercise[] = [
  // --- CHEST ---
  { id: 'c1', name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-10 reps', isFoundational: true },
  { id: 'c2', name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'c3', name: 'Flat Dumbbell Bench Press', muscle: 'Chest', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 8-12 reps', isFoundational: true },
  { id: 'c4', name: 'Push-Ups', muscle: 'Chest', equipment: 'bodyweight', location: 'home', category: 'compound', suggestedReps: '3 sets x Max reps', isFoundational: true },
  { id: 'c5', name: 'Incline Push-Ups', muscle: 'Chest', equipment: 'bodyweight', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-15 reps' },
  { id: 'c6', name: 'Knee Push-Ups', muscle: 'Chest', equipment: 'bodyweight', location: 'home', category: 'compound', suggestedReps: '3 sets x 8-12 reps' },
  { id: 'c7', name: 'Chest Press Machine', muscle: 'Chest', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'c8', name: 'Pec Dec Fly', muscle: 'Chest', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps', isFoundational: true },
  { id: 'c9', name: 'Cable Crossover', muscle: 'Chest', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'c10', name: 'Dumbbell Flys', muscle: 'Chest', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12-15 reps', isFoundational: true },
  { id: 'c11', name: 'Dumbbell Floor Press', muscle: 'Chest', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'c12', name: 'Chest Dips', muscle: 'Chest', equipment: 'bodyweight', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-12 reps' },
  { id: 'c13', name: 'Incline Barbell Bench Press', muscle: 'Chest', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-10 reps' },
  { id: 'c14', name: 'Decline Barbell Bench Press', muscle: 'Chest', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-10 reps' },
  { id: 'c15', name: 'Decline Push-Ups', muscle: 'Chest', equipment: 'bodyweight', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },

  // --- BACK ---
  { id: 'b1', name: 'Lat Pulldown Machine', muscle: 'Back', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps', isFoundational: true },
  { id: 'b2', name: 'Seated Cable Row', muscle: 'Back', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps', isFoundational: true },
  { id: 'b3', name: 'Barbell Bent-Over Row', muscle: 'Back', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-10 reps', isFoundational: true },
  { id: 'b4', name: 'One-Arm Dumbbell Row', muscle: 'Back', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps each', isFoundational: true },
  { id: 'b5', name: 'Pull-Ups', muscle: 'Back', equipment: 'bodyweight', location: 'gym', category: 'compound', suggestedReps: '3 sets x Max reps', isFoundational: true },
  { id: 'b6', name: 'Chin-Ups', muscle: 'Back', equipment: 'bodyweight', location: 'gym', category: 'compound', suggestedReps: '3 sets x Max reps' },
  { id: 'b7', name: 'Assisted Pull-Up Machine', muscle: 'Back', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'b8', name: 'Inverted Row', muscle: 'Back', equipment: 'bodyweight', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'b9', name: 'Barbell Deadlift', muscle: 'Back', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 5 reps', isFoundational: true },
  { id: 'b10', name: 'T-Bar Row Machine', muscle: 'Back', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-12 reps' },
  { id: 'b11', name: 'Dumbbell Chest-Supported Row', muscle: 'Back', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'b12', name: 'Straight-Arm Cable Pulldown', muscle: 'Back', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'b13', name: 'Hyperextensions (Back Extensions)', muscle: 'Back', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'b14', name: 'Superman Hold', muscle: 'Back', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 30-45 sec hold' },
  { id: 'b15', name: 'Kettlebell Deadlift', muscle: 'Back', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 12-15 reps' },

  // --- SHOULDERS ---
  { id: 's1', name: 'Dumbbell Shoulder Press', muscle: 'Shoulders', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 8-12 reps', isFoundational: true },
  { id: 's2', name: 'Barbell Overhead Press', muscle: 'Shoulders', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-10 reps', isFoundational: true },
  { id: 's3', name: 'Machine Shoulder Press', muscle: 'Shoulders', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 's4', name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12-15 reps', isFoundational: true },
  { id: 's5', name: 'Cable Lateral Raise', muscle: 'Shoulders', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 's6', name: 'Dumbbell Rear Delt Fly', muscle: 'Shoulders', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 's7', name: 'Machine Rear Delt Fly', muscle: 'Shoulders', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 's8', name: 'Cable Face Pulls', muscle: 'Shoulders', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 15 reps' },
  { id: 's9', name: 'Dumbbell Front Raise', muscle: 'Shoulders', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 's10', name: 'Arnold Press', muscle: 'Shoulders', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 's11', name: 'Barbell Shrugs', muscle: 'Shoulders', equipment: 'weights', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 's12', name: 'Dumbbell Shrugs', muscle: 'Shoulders', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 's13', name: 'Pike Push-Ups', muscle: 'Shoulders', equipment: 'bodyweight', location: 'home', category: 'compound', suggestedReps: '3 sets x 8-12 reps' },
  { id: 's14', name: 'Kettlebell Halos', muscle: 'Shoulders', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 10-12 reps' },
  { id: 's15', name: 'Cable Front Raise', muscle: 'Shoulders', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },

  // --- QUADS ---
  { id: 'q1', name: 'Barbell Back Squat', muscle: 'Quads', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-10 reps', isFoundational: true },
  { id: 'q2', name: 'Leg Press', muscle: 'Quads', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps', isFoundational: true },
  { id: 'q3', name: 'Leg Extension Machine', muscle: 'Quads', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps', isFoundational: true },
  { id: 'q4', name: 'Bodyweight Squats', muscle: 'Quads', equipment: 'bodyweight', location: 'home', category: 'compound', suggestedReps: '3 sets x 15-20 reps', isFoundational: true },
  { id: 'q5', name: 'Dumbbell Goblet Squat', muscle: 'Quads', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'q6', name: 'Kettlebell Goblet Squat', muscle: 'Quads', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'q7', name: 'Dumbbell Bulgarian Split Squat', muscle: 'Quads', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 8-12 reps each' },
  { id: 'q8', name: 'Walking Lunges', muscle: 'Quads', equipment: 'bodyweight', location: 'home', category: 'compound', suggestedReps: '3 sets x 12-15 steps' },
  { id: 'q9', name: 'Dumbbell Walking Lunges', muscle: 'Quads', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 12-15 steps' },
  { id: 'q10', name: 'Hack Squat Machine', muscle: 'Quads', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'q11', name: 'Smith Machine Squat', muscle: 'Quads', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'q12', name: 'Dumbbell Goblet Reverse Lunge', muscle: 'Quads', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps each' },
  { id: 'q13', name: 'Bodyweight Step-Ups', muscle: 'Quads', equipment: 'bodyweight', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps each' },
  { id: 'q14', name: 'Barbell Front Squat', muscle: 'Quads', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-10 reps' },
  { id: 'q15', name: 'Kettlebell Reverse Lunges', muscle: 'Quads', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps each' },

  // --- HAMSTRINGS ---
  { id: 'h1', name: 'Barbell Romanian Deadlift (RDL)', muscle: 'Hamstrings', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-10 reps', isFoundational: true },
  { id: 'h2', name: 'Dumbbell Romanian Deadlift', muscle: 'Hamstrings', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps', isFoundational: true },
  { id: 'h3', name: 'Kettlebell Romanian Deadlift', muscle: 'Hamstrings', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'h4', name: 'Seated Leg Curl Machine', muscle: 'Hamstrings', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'h5', name: 'Lying Leg Curl Machine', muscle: 'Hamstrings', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps', isFoundational: true },
  { id: 'h6', name: 'Glute Bridges', muscle: 'Hamstrings', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 15-20 reps' },
  { id: 'h7', name: 'Single-Leg Glute Bridges', muscle: 'Hamstrings', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 10-12 reps each' },
  { id: 'h8', name: 'Barbell Hip Thrust', muscle: 'Hamstrings', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'h9', name: 'Dumbbell Hip Thrust', muscle: 'Hamstrings', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'h10', name: 'Kettlebell Swings', muscle: 'Hamstrings', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 15-20 reps' },
  { id: 'h11', name: 'Leg Press (High Feet Placement)', muscle: 'Hamstrings', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'h12', name: 'Kettlebell Sumo Deadlift', muscle: 'Hamstrings', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'h13', name: 'Dumbbell Sumo Deadlift', muscle: 'Hamstrings', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'h14', name: 'Cable Pull-Through', muscle: 'Hamstrings', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'h15', name: 'Stability Ball Leg Curl', muscle: 'Hamstrings', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },

  // --- BICEPS ---
  { id: 'bi1', name: 'Dumbbell Bicep Curl', muscle: 'Biceps', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 10-12 reps', isFoundational: true },
  { id: 'bi2', name: 'Dumbbell Hammer Curl', muscle: 'Biceps', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 10-12 reps', isFoundational: true },
  { id: 'bi3', name: 'Barbell Bicep Curl', muscle: 'Biceps', equipment: 'weights', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 8-12 reps', isFoundational: true },
  { id: 'bi4', name: 'EZ-Bar Bicep Curl', muscle: 'Biceps', equipment: 'weights', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 8-12 reps' },
  { id: 'bi5', name: 'Cable Bicep Curl', muscle: 'Biceps', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'bi6', name: 'Concentration Curl', muscle: 'Biceps', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12 reps' },
  { id: 'bi7', name: 'Incline Dumbbell Bicep Curl', muscle: 'Biceps', equipment: 'weights', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'bi8', name: 'Preacher Curl Machine', muscle: 'Biceps', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'bi9', name: 'Kettlebell Bicep Curl', muscle: 'Biceps', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'bi10', name: 'Preacher Curl (EZ-Bar)', muscle: 'Biceps', equipment: 'weights', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'bi11', name: 'Chin-Ups (Underhand Grip)', muscle: 'Biceps', equipment: 'bodyweight', location: 'gym', category: 'compound', suggestedReps: '3 sets x Max reps' },
  { id: 'bi12', name: 'Inverted Rows (Underhand Grip)', muscle: 'Biceps', equipment: 'bodyweight', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-12 reps' },

  // --- TRICEPS ---
  { id: 'tr1', name: 'Cable Triceps Rope Pushdown', muscle: 'Triceps', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps', isFoundational: true },
  { id: 'tr2', name: 'Cable Triceps Straight Bar Pushdown', muscle: 'Triceps', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'tr3', name: 'Dumbbell Overhead Tricep Extension', muscle: 'Triceps', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 10-12 reps', isFoundational: true },
  { id: 'tr4', name: 'Bench / Chair Dips', muscle: 'Triceps', equipment: 'bodyweight', location: 'home', category: 'compound', suggestedReps: '3 sets x 12-15 reps', isFoundational: true },
  { id: 'tr5', name: 'Diamond Push-Ups', muscle: 'Triceps', equipment: 'bodyweight', location: 'home', category: 'compound', suggestedReps: '3 sets x Max reps' },
  { id: 'tr6', name: 'Lying Triceps Extensions (Skull Crushers)', muscle: 'Triceps', equipment: 'weights', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 10-12 reps', isFoundational: true },
  { id: 'tr7', name: 'Dumbbell Tricep Kickbacks', muscle: 'Triceps', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'tr8', name: 'Overhead Cable Tricep Extension', muscle: 'Triceps', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'tr9', name: 'Close-Grip Barbell Bench Press', muscle: 'Triceps', equipment: 'weights', location: 'gym', category: 'compound', suggestedReps: '3 sets x 8-10 reps' },
  { id: 'tr10', name: 'Assisted Dip Machine', muscle: 'Triceps', equipment: 'machine', location: 'gym', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'tr11', name: 'Close-Grip Dumbbell Floor Press', muscle: 'Triceps', equipment: 'weights', location: 'home', category: 'compound', suggestedReps: '3 sets x 10-12 reps' },
  { id: 'tr12', name: 'Kettlebell Overhead Tricep Extension', muscle: 'Triceps', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 10-12 reps' },

  // --- ABS ---
  { id: 'a1', name: 'Floor Crunches', muscle: 'Abs', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 15-20 reps', isFoundational: true },
  { id: 'a2', name: 'Plank', muscle: 'Abs', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 45-60 sec hold', isFoundational: true },
  { id: 'a3', name: 'Lying Leg Raises', muscle: 'Abs', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'a4', name: 'Hanging Knee Raises', muscle: 'Abs', equipment: 'bodyweight', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'a5', name: 'Cable Crunch', muscle: 'Abs', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 15 reps' },
  { id: 'a6', name: 'Bicycle Crunches', muscle: 'Abs', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 20 reps' },
  { id: 'a7', name: 'Russian Twists', muscle: 'Abs', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 20 reps total' },
  { id: 'a8', name: 'Reverse Crunches', muscle: 'Abs', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'a9', name: 'Plank Shoulder Taps', muscle: 'Abs', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 20 taps' },
  { id: 'a10', name: 'Deadbug', muscle: 'Abs', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 10 reps each side' },
  { id: 'a11', name: 'Ab Crunch Machine', muscle: 'Abs', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'a12', name: 'Mountain Climbers', muscle: 'Abs', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 30-45 sec' },

  // --- CALVES ---
  { id: 'ca1', name: 'Standing Calf Raises', muscle: 'Calves', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 20 reps', isFoundational: true },
  { id: 'ca2', name: 'Single-Leg Calf Raises', muscle: 'Calves', equipment: 'bodyweight', location: 'home', category: 'isolation', suggestedReps: '3 sets x 12-15 reps each' },
  { id: 'ca3', name: 'Seated Calf Raise Machine', muscle: 'Calves', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 15-20 reps', isFoundational: true },
  { id: 'ca4', name: 'Calf Press on Leg Press', muscle: 'Calves', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 15-20 reps' },
  { id: 'ca5', name: 'Dumbbell Standing Calf Raise', muscle: 'Calves', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 15 reps' },
  { id: 'ca6', name: 'Kettlebell Standing Calf Raise', muscle: 'Calves', equipment: 'weights', location: 'home', category: 'isolation', suggestedReps: '3 sets x 15 reps' },
  { id: 'ca7', name: 'Barbell Standing Calf Raise', muscle: 'Calves', equipment: 'weights', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 12-15 reps' },
  { id: 'ca8', name: 'Standing Calf Raise Machine', muscle: 'Calves', equipment: 'machine', location: 'gym', category: 'isolation', suggestedReps: '3 sets x 15-20 reps' }
];

// Split template structures
// Muscle targets for each day in each split
export interface MuscleSlot {
  muscle: string;
  categoryPreference?: 'compound' | 'isolation';
}

export const SPLIT_TEMPLATES: Record<string, {
  name: string;
  days: {
    dayName: string;
    title: string;
    note: string;
    isRest: boolean;
    slots: MuscleSlot[];
  }[];
}> = {
  '4-day': {
    name: '4-day Upper / Lower Body',
    days: [
      {
        dayName: 'Monday',
        title: 'Upper Body A',
        note: 'Focus on chest and back power',
        isRest: false,
        slots: [
          { muscle: 'Chest', categoryPreference: 'compound' },
          { muscle: 'Back', categoryPreference: 'compound' },
          { muscle: 'Shoulders', categoryPreference: 'compound' },
          { muscle: 'Chest', categoryPreference: 'isolation' },
          { muscle: 'Back', categoryPreference: 'isolation' },
          { muscle: 'Triceps', categoryPreference: 'isolation' },
          { muscle: 'Biceps', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Tuesday',
        title: 'Lower Body A',
        note: 'Squat and posterior chain emphasis',
        isRest: false,
        slots: [
          { muscle: 'Quads', categoryPreference: 'compound' },
          { muscle: 'Hamstrings', categoryPreference: 'compound' },
          { muscle: 'Quads', categoryPreference: 'isolation' },
          { muscle: 'Hamstrings', categoryPreference: 'isolation' },
          { muscle: 'Calves', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Wednesday',
        title: 'Active Recovery',
        note: 'Stretching, walking or full rest',
        isRest: true,
        slots: []
      },
      {
        dayName: 'Thursday',
        title: 'Upper Body B',
        note: 'Focus on shoulder and arm development',
        isRest: false,
        slots: [
          { muscle: 'Back', categoryPreference: 'compound' },
          { muscle: 'Chest', categoryPreference: 'compound' },
          { muscle: 'Shoulders', categoryPreference: 'isolation' },
          { muscle: 'Biceps', categoryPreference: 'isolation' },
          { muscle: 'Triceps', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Friday',
        title: 'Lower Body B',
        note: 'Leg press and single-leg stability',
        isRest: false,
        slots: [
          { muscle: 'Quads', categoryPreference: 'compound' },
          { muscle: 'Hamstrings', categoryPreference: 'compound' },
          { muscle: 'Quads', categoryPreference: 'isolation' },
          { muscle: 'Hamstrings', categoryPreference: 'isolation' },
          { muscle: 'Calves', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Saturday',
        title: 'Rest Day',
        note: 'Relax and allow muscle fibers to repair',
        isRest: true,
        slots: []
      },
      {
        dayName: 'Sunday',
        title: 'Rest Day',
        note: 'Relax and prepare for next week',
        isRest: true,
        slots: []
      }
    ]
  },
  '5-day': {
    name: '5-day Split (Push / Pull / Legs / Upper / Lower)',
    days: [
      {
        dayName: 'Monday',
        title: 'Chest + Shoulders + Triceps',
        note: 'All upper body pushing muscles',
        isRest: false,
        slots: [
          { muscle: 'Chest', categoryPreference: 'compound' },
          { muscle: 'Shoulders', categoryPreference: 'compound' },
          { muscle: 'Chest', categoryPreference: 'isolation' },
          { muscle: 'Shoulders', categoryPreference: 'isolation' },
          { muscle: 'Triceps', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Tuesday',
        title: 'Back + Biceps',
        note: 'All upper body pulling muscles',
        isRest: false,
        slots: [
          { muscle: 'Back', categoryPreference: 'compound' },
          { muscle: 'Back', categoryPreference: 'isolation' },
          { muscle: 'Biceps', categoryPreference: 'isolation' },
          { muscle: 'Biceps', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Wednesday',
        title: 'Legs Day',
        note: 'Full lower body routine',
        isRest: false,
        slots: [
          { muscle: 'Quads', categoryPreference: 'compound' },
          { muscle: 'Hamstrings', categoryPreference: 'compound' },
          { muscle: 'Quads', categoryPreference: 'isolation' },
          { muscle: 'Hamstrings', categoryPreference: 'isolation' },
          { muscle: 'Calves', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Thursday',
        title: 'Rest Day',
        note: 'Mid-week muscle recovery',
        isRest: true,
        slots: []
      },
      {
        dayName: 'Friday',
        title: 'Upper Body',
        note: 'High density upper body training',
        isRest: false,
        slots: [
          { muscle: 'Chest', categoryPreference: 'compound' },
          { muscle: 'Back', categoryPreference: 'compound' },
          { muscle: 'Shoulders', categoryPreference: 'isolation' },
          { muscle: 'Biceps', categoryPreference: 'isolation' },
          { muscle: 'Triceps', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Saturday',
        title: 'Lower Body',
        note: 'Secondary leg stimulation',
        isRest: false,
        slots: [
          { muscle: 'Quads', categoryPreference: 'compound' },
          { muscle: 'Hamstrings', categoryPreference: 'compound' },
          { muscle: 'Hamstrings', categoryPreference: 'isolation' },
          { muscle: 'Calves', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Sunday',
        title: 'Rest Day',
        note: 'Rest and repair',
        isRest: true,
        slots: []
      }
    ]
  },
  '6-day': {
    name: '6-day Push / Pull / Legs Split',
    days: [
      {
        dayName: 'Monday',
        title: 'Push A (Chest, Shoulders, Triceps)',
        note: 'Focus on compound press movements',
        isRest: false,
        slots: [
          { muscle: 'Chest', categoryPreference: 'compound' },
          { muscle: 'Shoulders', categoryPreference: 'compound' },
          { muscle: 'Chest', categoryPreference: 'isolation' },
          { muscle: 'Shoulders', categoryPreference: 'isolation' },
          { muscle: 'Triceps', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Tuesday',
        title: 'Pull A (Back, Biceps, Rear Delts)',
        note: 'Focus on row and carry motions',
        isRest: false,
        slots: [
          { muscle: 'Back', categoryPreference: 'compound' },
          { muscle: 'Back', categoryPreference: 'isolation' },
          { muscle: 'Shoulders', categoryPreference: 'isolation' }, // Rear Delts
          { muscle: 'Biceps', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Wednesday',
        title: 'Legs A (Quads-focused)',
        note: 'Quad development & lower back',
        isRest: false,
        slots: [
          { muscle: 'Quads', categoryPreference: 'compound' },
          { muscle: 'Quads', categoryPreference: 'isolation' },
          { muscle: 'Hamstrings', categoryPreference: 'compound' },
          { muscle: 'Calves', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Thursday',
        title: 'Push B (Shoulder & Chest variation)',
        note: 'Incline presses & high-rep raises',
        isRest: false,
        slots: [
          { muscle: 'Shoulders', categoryPreference: 'compound' },
          { muscle: 'Chest', categoryPreference: 'compound' },
          { muscle: 'Chest', categoryPreference: 'isolation' },
          { muscle: 'Triceps', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Friday',
        title: 'Pull B (Lat & Arm focus)',
        note: 'Vertical pull emphasis & high volume arm work',
        isRest: false,
        slots: [
          { muscle: 'Back', categoryPreference: 'compound' },
          { muscle: 'Back', categoryPreference: 'isolation' },
          { muscle: 'Biceps', categoryPreference: 'isolation' },
          { muscle: 'Biceps', categoryPreference: 'isolation' },
          { muscle: 'Abs', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Saturday',
        title: 'Legs B (Hamstring-focused)',
        note: 'Deadlift variations and glute bridges',
        isRest: false,
        slots: [
          { muscle: 'Hamstrings', categoryPreference: 'compound' },
          { muscle: 'Hamstrings', categoryPreference: 'isolation' },
          { muscle: 'Quads', categoryPreference: 'compound' },
          { muscle: 'Calves', categoryPreference: 'isolation' },
        ]
      },
      {
        dayName: 'Sunday',
        title: 'Rest Day',
        note: 'Full recovery, rest and rebuild',
        isRest: true,
        slots: []
      }
    ]
  }
};

/**
 * Filter exercises from database based on user environment selection.
 */
export function getFilteredExercises(
  location: 'gym' | 'home',
  equipmentPref: 'bodyweight' | 'weights' | 'machines' | 'mix'
): Exercise[] {
  return EXERCISE_DATABASE.filter(ex => {
    // 1. Location match
    // Gym exercises include everything. Home exercises must support 'home' location
    if (location === 'home' && ex.location !== 'home') {
      return false;
    }

    // 2. Equipment match
    if (equipmentPref === 'bodyweight') {
      return ex.equipment === 'bodyweight';
    } else if (equipmentPref === 'weights') {
      // Home weights can do weights and bodyweight
      return ex.equipment === 'weights' || ex.equipment === 'bodyweight';
    } else if (equipmentPref === 'machines') {
      // Machine-focused, fall back to bodyweight/weights if necessary
      return ex.equipment === 'machine' || ex.equipment === 'bodyweight';
    } else {
      // 'mix' matches everything
      return true;
    }
  });
}

/**
 * Helper to select an exercise from candidate matches, applying custom probability bias for "balanced" (mix) equipment style:
 * - Gym + balanced: bias towards freewights (weights) and machines.
 * - Home + balanced: bias towards bodyweight and some free weights.
 */
export function selectExerciseFromMatches(
  matches: Exercise[],
  location: 'gym' | 'home',
  equipmentPref: 'bodyweight' | 'weights' | 'machines' | 'mix'
): Exercise {
  if (matches.length === 0) return EXERCISE_DATABASE[0];

  let candidates = [...matches];

  if (equipmentPref === 'mix') {
    if (location === 'gym') {
      // Gym + balanced mix: emphasizes free weights (weights) and machines (machine)
      const gymMixMatches = candidates.filter(ex => ex.equipment === 'weights' || ex.equipment === 'machine');
      if (gymMixMatches.length > 0) {
        candidates = gymMixMatches;
      }
    } else if (location === 'home') {
      // Home + balanced mix: shows more of bodyweight (70%) and some free weights (30%)
      const bodyweightMatches = candidates.filter(ex => ex.equipment === 'bodyweight');
      const freeWeightsMatches = candidates.filter(ex => ex.equipment === 'weights');
      
      if (bodyweightMatches.length > 0 && freeWeightsMatches.length > 0) {
        if (Math.random() < 0.70) {
          candidates = bodyweightMatches;
        } else {
          candidates = freeWeightsMatches;
        }
      } else if (bodyweightMatches.length > 0) {
        candidates = bodyweightMatches;
      } else if (freeWeightsMatches.length > 0) {
        candidates = freeWeightsMatches;
      }
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)] || matches[0];
}

export type TargetGoal = 'fat_loss' | 'stamina' | 'muscle_build' | 'strength';

export function getAdjustedReps(baseReps: string, targetGoal: TargetGoal): string {
  const setsMatch = baseReps.match(/(\d+)\s*sets/i);
  const sets = setsMatch ? parseInt(setsMatch[1], 10) : 3;
  const isHold = baseReps.toLowerCase().includes('hold') || baseReps.toLowerCase().includes('sec');
  const isMax = baseReps.toLowerCase().includes('max');

  if (targetGoal === 'strength') {
    if (isHold) {
      return `${sets + 1} sets x ${baseReps.replace(/^\d+\s*sets\s*x\s*/i, '')} (Max Effort)`;
    }
    return `${sets + 1} sets x 4-6 reps (Heavy weight, 2 min rest)`;
  } else if (targetGoal === 'fat_loss') {
    if (isHold) {
      return `${sets} sets x ${baseReps.replace(/^\d+\s*sets\s*x\s*/i, '')} (Short 30s rest)`;
    }
    if (isMax) {
      return `${sets} sets x Max reps (High Intensity Pace)`;
    }
    return `${sets} sets x 12-15 reps (Fast Tempo, 45s rest)`;
  } else if (targetGoal === 'stamina') {
    if (isHold) {
      return `${sets} sets x 45-60 sec hold (Endurance Focus)`;
    }
    return `${sets} sets x 15-20 reps (Aerobic Conditioning)`;
  } else {
    // muscle_build
    if (isHold) {
      return baseReps;
    }
    return `${sets} sets x 8-12 reps (Controlled Negatives)`;
  }
}

/**
 * Generate a complete custom 7-day program based on user choices.
 */
export function generatePlan(
  splitType: '4-day' | '5-day' | '6-day',
  location: 'gym' | 'home',
  equipmentPref: 'bodyweight' | 'weights' | 'machines' | 'mix',
  expectedTime: '30 min' | '45 min' | '60 min' | '90 min',
  targetGoal: TargetGoal = 'muscle_build'
): DayPlan[] {
  const template = SPLIT_TEMPLATES[splitType];
  const pool = getFilteredExercises(location, equipmentPref);

  // Expected gym time determines the limit on exercises per day
  let maxExercises = 6;
  if (expectedTime === '30 min') maxExercises = 4;
  else if (expectedTime === '45 min') maxExercises = 5;
  else if (expectedTime === '60 min') maxExercises = 6;
  else if (expectedTime === '90 min') maxExercises = 8;

  return template.days.map((day, dayIndex) => {
    const dayLabel = `Day ${dayIndex + 1}`;
    if (day.isRest) {
      return {
        day: dayLabel,
        title: day.title,
        note: day.note,
        badge: 'Recovery',
        rest: true,
      };
    }

    // Limit slots based on selected gym time
    const activeSlots = day.slots.slice(0, maxExercises);

    // Track used exercises on this day so we don't repeat the exact same name
    const usedIds = new Set<string>();

    const exercises = activeSlots.map((slot, index) => {
      // Find matching exercises in pool
      let matches = pool.filter(ex => ex.muscle === slot.muscle && !usedIds.has(ex.id));

      // Try category match if specified
      if (slot.categoryPreference) {
        const catMatches = matches.filter(ex => ex.category === slot.categoryPreference);
        if (catMatches.length > 0) {
          matches = catMatches;
        }
      }

      // Try foundational match first to prioritize well-known exercises
      const foundationalMatches = matches.filter(ex => ex.isFoundational);
      if (foundationalMatches.length > 0) {
        matches = foundationalMatches;
      }

      // If no matches with unused, relax used check
      if (matches.length === 0) {
        matches = pool.filter(ex => ex.muscle === slot.muscle);
        // Try foundational match first even when relaxing used check
        const foundationalFallback = matches.filter(ex => ex.isFoundational);
        if (foundationalFallback.length > 0) {
          matches = foundationalFallback;
        }
      }

      // If still no matches, relax muscle check (pick any exercise in pool of same category, or absolute fallback)
      if (matches.length === 0) {
        matches = pool;
      }

      // Select random exercise from matches using weighted selection
      const selected = selectExerciseFromMatches(matches, location, equipmentPref);
      usedIds.add(selected.id);

      return {
        id: selected.id,
        name: selected.name,
        muscle: selected.muscle,
        suggestedReps: getAdjustedReps(selected.suggestedReps, targetGoal),
        done: false,
        slotId: `${dayLabel}-slot-${index}-${slot.muscle}-${slot.categoryPreference || 'any'}`
      };
    });

    return {
      day: dayLabel,
      title: day.title,
      note: day.note,
      badge: 'Workout',
      rest: false,
      exercises
    };
  });
}

/**
 * Shuffles a single exercise for a day, keeping the target muscle
 */
export function shuffleSingleExercise(
  dayPlan: DayPlan,
  exerciseIndex: number,
  location: 'gym' | 'home',
  equipmentPref: 'bodyweight' | 'weights' | 'machines' | 'mix',
  targetGoal: TargetGoal = 'muscle_build'
): DayPlan {
  if (!dayPlan.exercises || dayPlan.rest) return dayPlan;

  const targetExercise = dayPlan.exercises[exerciseIndex];
  
  // 1. Only shuffle if not checked off
  if (targetExercise.done) return dayPlan;

  const targetMuscle = targetExercise.muscle;

  const pool = getFilteredExercises(location, equipmentPref);
  // Find all matches for this muscle group
  let matches = pool.filter(ex => ex.muscle === targetMuscle);

  // Exclude exercises currently in this day's plan so we don't duplicate
  const currentDayExNames = dayPlan.exercises.map(e => e.name);
  let freshMatches = matches.filter(ex => !currentDayExNames.includes(ex.name));

  // Try foundational match first for fresh matches
  const foundationalFresh = freshMatches.filter(ex => ex.isFoundational);
  if (foundationalFresh.length > 0) {
    freshMatches = foundationalFresh;
  }

  if (freshMatches.length === 0) {
    // fall back to anything of same muscle group
    freshMatches = matches;
    const foundationalFallback = freshMatches.filter(ex => ex.isFoundational);
    if (foundationalFallback.length > 0) {
      freshMatches = foundationalFallback;
    }
  }

  if (freshMatches.length > 0) {
    const selected = selectExerciseFromMatches(freshMatches, location, equipmentPref);
    const updatedExercises = [...dayPlan.exercises];
    updatedExercises[exerciseIndex] = {
      ...targetExercise,
      id: selected.id,
      name: selected.name,
      suggestedReps: getAdjustedReps(selected.suggestedReps, targetGoal),
      done: false // Reset done state on shuffle
    };
    return {
      ...dayPlan,
      exercises: updatedExercises
    };
  }

  return dayPlan;
}

/**
 * Shuffles all exercises for a day, keeping muscles constant
 */
export function shuffleAllExercisesInDay(
  dayPlan: DayPlan,
  location: 'gym' | 'home',
  equipmentPref: 'bodyweight' | 'weights' | 'machines' | 'mix',
  targetGoal: TargetGoal = 'muscle_build'
): DayPlan {
  if (!dayPlan.exercises || dayPlan.rest) return dayPlan;

  let currentPlan = { ...dayPlan };
  for (let i = 0; i < (dayPlan.exercises || []).length; i++) {
    // 1. Only shuffle exercises which are NOT checked off
    if (!dayPlan.exercises[i].done) {
      currentPlan = shuffleSingleExercise(currentPlan, i, location, equipmentPref, targetGoal);
    }
  }
  return currentPlan;
}
