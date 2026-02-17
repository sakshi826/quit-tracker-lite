export interface WithdrawalLog {
  id: string;
  timestamp: string;
  severity: number;
  physicalSymptoms: string[];
  psychSymptoms: string[];
  sleepSymptoms: string[];
  copingMethods: string[];
  notes: string;
}

export const PHYSICAL_SYMPTOMS = [
  "Headache", "Nausea", "Dizziness", "Increased cough", "Chest tightness",
  "Constipation", "Increased appetite", "Sweating", "Tremors", "Fatigue",
];

export const PSYCH_SYMPTOMS = [
  "Intense cravings", "Irritability", "Anxiety", "Restlessness",
  "Difficulty concentrating", "Low mood", "Mood swings",
];

export const SLEEP_SYMPTOMS = [
  "Insomnia", "Night sweats", "Vivid dreams", "Frequent waking",
];

export const COPING_METHODS = [
  "Controlled breathing", "Hydration", "Physical activity", "Social support",
  "Mindfulness", "NRT", "Prescribed medication", "Distraction", "None",
];

export const MILESTONES = [
  { minutes: 20, label: "Heart rate and blood pressure begin to normalise." },
  { minutes: 480, label: "Blood oxygen levels return to normal range." },
  { minutes: 1440, label: "Carbon monoxide fully cleared from bloodstream." },
  { minutes: 2880, label: "Nerve endings begin regenerating." },
  { minutes: 4320, label: "Nicotine metabolites fully cleared. Withdrawal typically peaks." },
  { minutes: 10080, label: "Breathing becomes noticeably easier." },
  { minutes: 20160, label: "Circulation begins improving." },
  { minutes: 43200, label: "Cough and fatigue reduce significantly." },
  { minutes: 129600, label: "Lung function increases by up to 10%." },
  { minutes: 525600, label: "Coronary heart disease risk reduced by 50%." },
  { minutes: 2628000, label: "Stroke risk equivalent to a non-smoker." },
  { minutes: 5256000, label: "Lung cancer risk reduced by approximately 50%." },
  { minutes: 7884000, label: "Heart disease risk equivalent to a lifetime non-smoker." },
];

export function getMilestoneTimeLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${minutes / 60} hrs`;
  if (minutes < 10080) return `${Math.round(minutes / 1440)} days`;
  if (minutes < 43200) return `${Math.round(minutes / 10080)} weeks`;
  if (minutes < 525600) return `${Math.round(minutes / 43200)} months`;
  return `${Math.round(minutes / 525600)} years`;
}

export function formatDateDDMMYYYY(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function formatTimeIST(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

export function daysSince(quitDate: string): number {
  const now = new Date();
  const quit = new Date(quitDate);
  return Math.floor((now.getTime() - quit.getTime()) / (1000 * 60 * 60 * 24));
}

export function minutesSince(quitDate: string): number {
  const now = new Date();
  const quit = new Date(quitDate);
  return Math.floor((now.getTime() - quit.getTime()) / (1000 * 60));
}

export function getSeverityLabel(s: number): string {
  if (s <= 3) return "Mild";
  if (s <= 6) return "Moderate";
  if (s <= 8) return "Significant";
  return "Severe";
}
