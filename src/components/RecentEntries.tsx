import { useState } from "react";
import { WithdrawalLog, formatTimeIST } from "@/lib/types";
import { removeLog } from "@/lib/storage";

interface RecentEntriesProps {
  logs: WithdrawalLog[];
  onOpenHistory: () => void;
  onChanged: () => void;
}

const severityBadge = (s: number) => {
  if (s <= 3) return { bg: "bg-success-light", text: "text-success" };
  if (s <= 6) return { bg: "bg-warning-light", text: "text-warning" };
  return { bg: "bg-alert-light", text: "text-alert" };
};

const dominantCategory = (log: WithdrawalLog) => {
  const counts = [
    { label: "Physical", count: log.physicalSymptoms.length },
    { label: "Psychological", count: log.psychSymptoms.length },
    { label: "Sleep", count: log.sleepSymptoms.length },
  ];
  const max = counts.sort((a, b) => b.count - a.count)[0];
  return max.count > 0 ? max.label : null;
};

const RecentEntries = ({ logs, onOpenHistory, onChanged }: RecentEntriesProps) => {
  const recent = logs.slice(0, 5);
  const [swipedId, setSwipedId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    removeLog(id);
    setSwipedId(null);
    onChanged();
  };

  if (recent.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-sm font-bold text-muted-foreground px-1">Recent Entries</h3>
      <div className="space-y-2">
        {recent.map((log) => {
          const badge = severityBadge(log.severity);
          const cat = dominantCategory(log);
          const allSymptoms = [...log.physicalSymptoms, ...log.psychSymptoms, ...log.sleepSymptoms].slice(0, 3);
          const copingDisplay = log.copingMethods.slice(0, 2);
          const isSwiped = swipedId === log.id;

          return (
            <div key={log.id} className="relative overflow-hidden rounded-xl">
              {/* Remove button behind */}
              <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-destructive rounded-r-xl">
                <button onClick={() => handleRemove(log.id)} className="text-destructive-foreground font-body text-sm font-medium">
                  Remove
                </button>
              </div>

              <div
                className={`relative bg-card border border-border rounded-xl px-4 py-3 space-y-2 transition-transform duration-200 ${isSwiped ? "-translate-x-20" : ""}`}
                onClick={() => setSwipedId(isSwiped ? null : log.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="stat-pill text-xs py-1 px-2">{formatTimeIST(new Date(log.timestamp))}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                      {log.severity}/10
                    </span>
                  </div>
                  {cat && (
                    <span className="chip-unselected text-xs py-1 px-2">{cat}</span>
                  )}
                </div>

                {(allSymptoms.length > 0 || copingDisplay.length > 0) && (
                  <div className="flex flex-wrap gap-1.5">
                    {allSymptoms.map((s) => (
                      <span key={s} className="chip-unselected text-xs py-1 px-2">{s}</span>
                    ))}
                    {copingDisplay.map((c) => (
                      <span key={c} className="chip-selected text-xs py-1 px-2">{c}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onOpenHistory} className="w-full text-center font-body text-sm text-primary font-medium py-2">
        View all
      </button>
    </div>
  );
};

export default RecentEntries;
