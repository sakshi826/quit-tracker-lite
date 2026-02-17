import { WithdrawalLog } from "@/lib/types";

interface TodaySnapshotProps {
  logs: WithdrawalLog[];
}

const TodaySnapshot = ({ logs }: TodaySnapshotProps) => {
  const today = new Date().toDateString();
  const todayLogs = logs.filter((l) => new Date(l.timestamp).toDateString() === today);

  const count = todayLogs.length;
  const avg = count > 0 ? (todayLogs.reduce((s, l) => s + l.severity, 0) / count).toFixed(1) : "--";

  // Most reported symptom
  const freq: Record<string, number> = {};
  todayLogs.forEach((l) => {
    [...l.physicalSymptoms, ...l.psychSymptoms, ...l.sleepSymptoms].forEach((s) => {
      freq[s] = (freq[s] || 0) + 1;
    });
  });
  const topSymptom = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || "--";

  return (
    <div className="card-base space-y-3">
      <h2 className="section-title">Today</h2>
      <div className="flex flex-wrap gap-2">
        <span className="stat-pill">Entries: {count}</span>
        <span className="stat-pill">Avg severity: {avg}/10</span>
        <span className="stat-pill">Most reported: {topSymptom}</span>
      </div>
    </div>
  );
};

export default TodaySnapshot;
