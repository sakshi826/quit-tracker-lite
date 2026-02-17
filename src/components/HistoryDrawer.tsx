import { useState, useMemo } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { X } from "lucide-react";
import { WithdrawalLog, formatDateDDMMYYYY, formatTimeIST, getMilestoneTimeLabel, MILESTONES, minutesSince } from "@/lib/types";
import { removeLog, getQuitDate } from "@/lib/storage";

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  logs: WithdrawalLog[];
  onChanged: () => void;
}

const HistoryDrawer = ({ open, onClose, logs, onChanged }: HistoryDrawerProps) => {
  const [search, setSearch] = useState("");
  const [swipedId, setSwipedId] = useState<string | null>(null);

  const qd = getQuitDate();
  const elapsed = qd ? minutesSince(qd) : 0;

  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (l) =>
        l.notes.toLowerCase().includes(q) ||
        [...l.physicalSymptoms, ...l.psychSymptoms, ...l.sleepSymptoms, ...l.copingMethods].some((s) => s.toLowerCase().includes(q))
    );
  }, [logs, search]);

  // Group by date
  const grouped = useMemo(() => {
    const map: Record<string, WithdrawalLog[]> = {};
    filteredLogs.forEach((l) => {
      const key = new Date(l.timestamp).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(l);
    });
    return Object.entries(map);
  }, [filteredLogs]);

  // Severity trend (last 14)
  const trendData = logs.slice(0, 14).reverse();
  const isDownward = trendData.length >= 3 && trendData[trendData.length - 1].severity < trendData[0].severity;

  // Symptom frequency
  const symptomFreq = useMemo(() => {
    const freq: Record<string, number> = {};
    logs.forEach((l) => {
      [...l.physicalSymptoms, ...l.psychSymptoms, ...l.sleepSymptoms].forEach((s) => {
        freq[s] = (freq[s] || 0) + 1;
      });
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [logs]);

  const maxFreq = symptomFreq[0]?.[1] || 1;

  // Milestones reached
  const milestonesReached = MILESTONES.filter((m) => elapsed >= m.minutes);

  const handleRemove = (id: string) => {
    removeLog(id);
    setSwipedId(null);
    onChanged();
  };

  const handleExport = () => {
    const csv = [
      "Date,Time,Severity,Physical,Psychological,Sleep,Coping,Notes",
      ...logs.map((l) => {
        const d = new Date(l.timestamp);
        return `${formatDateDDMMYYYY(d)},${formatTimeIST(d)},${l.severity},"${l.physicalSymptoms.join("; ")}","${l.psychSymptoms.join("; ")}","${l.sleepSymptoms.join("; ")}","${l.copingMethods.join("; ")}","${l.notes}"`;
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `withdrawal-log-${formatDateDDMMYYYY(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // SVG chart
  const chartW = 320;
  const chartH = 120;
  const padX = 24;
  const padY = 16;
  const innerW = chartW - padX * 2;
  const innerH = chartH - padY * 2;

  const trendPoints = trendData.map((d, i) => {
    const x = padX + (trendData.length > 1 ? (i / (trendData.length - 1)) * innerW : innerW / 2);
    const y = padY + innerH - ((d.severity - 1) / 9) * innerH;
    return { x, y, severity: d.severity };
  });

  const linePath = trendPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="h-[95vh] bg-background rounded-t-3xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
            <h2 className="font-heading text-base font-bold text-foreground">Withdrawal Records</h2>
            <button onClick={onClose} className="p-1"><X size={20} className="text-muted-foreground" /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4 pt-4">
            {/* Severity trend chart */}
            {trendData.length > 1 && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="label-text mb-2">Severity trend (last {trendData.length} entries)</p>
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ maxHeight: 140 }}>
                  {/* Grid */}
                  {[1, 5, 10].map((v) => {
                    const y = padY + innerH - ((v - 1) / 9) * innerH;
                    return (
                      <g key={v}>
                        <line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="hsl(var(--border-light))" strokeWidth="1" />
                        <text x={padX - 4} y={y + 3} textAnchor="end" fontSize="9" fill="hsl(var(--muted-foreground))">{v}</text>
                      </g>
                    );
                  })}
                  {/* Reference at 5 */}
                  <line x1={padX} y1={padY + innerH - ((5 - 1) / 9) * innerH} x2={chartW - padX} y2={padY + innerH - ((5 - 1) / 9) * innerH} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
                  {/* Line */}
                  <path d={linePath} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                  {/* Dots */}
                  {trendPoints.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3" fill="hsl(var(--primary))" />
                  ))}
                </svg>
                {isDownward && (
                  <p className="label-text mt-2">Severity has trended lower over this period.</p>
                )}
              </div>
            )}

            {/* Symptom frequency */}
            {symptomFreq.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="label-text mb-3">Symptom frequency</p>
                <div className="space-y-2">
                  {symptomFreq.map(([name, count]) => (
                    <div key={name} className="flex items-center gap-2">
                      <span className="font-body text-xs text-body w-28 truncate flex-shrink-0">{name}</span>
                      <div className="flex-1 h-4 bg-surface-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(count / maxFreq) * 100}%` }}
                        />
                      </div>
                      <span className="font-body text-xs text-muted-foreground w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries..."
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card outline-none transition-colors"
            />

            {/* Log list */}
            {grouped.map(([dateStr, entries]) => (
              <div key={dateStr} className="space-y-2">
                <p className="font-heading text-xs font-semibold text-muted-foreground">{formatDateDDMMYYYY(new Date(dateStr))}</p>
                {entries.map((log) => {
                  const isSwiped = swipedId === log.id;
                  const badge = log.severity <= 3 ? "bg-success-light text-success" : log.severity <= 6 ? "bg-warning-light text-warning" : "bg-alert-light text-alert";
                  return (
                    <div key={log.id} className="relative overflow-hidden rounded-xl">
                      <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-destructive rounded-r-xl">
                        <button onClick={() => handleRemove(log.id)} className="text-destructive-foreground font-body text-sm font-medium">Remove</button>
                      </div>
                      <div
                        className={`relative bg-card border border-border rounded-xl px-4 py-3 transition-transform duration-200 ${isSwiped ? "-translate-x-20" : ""}`}
                        onClick={() => setSwipedId(isSwiped ? null : log.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="stat-pill text-xs py-1 px-2">{formatTimeIST(new Date(log.timestamp))}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge}`}>{log.severity}/10</span>
                          {log.notes && <span className="font-body text-xs text-muted-foreground truncate flex-1">{log.notes}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Milestones reached */}
            {milestonesReached.length > 0 && (
              <div className="space-y-2">
                <p className="font-heading text-xs font-semibold text-muted-foreground">Milestones Reached</p>
                <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
                  {milestonesReached.map((m, i) => {
                    const achievedDate = qd ? new Date(new Date(qd).getTime() + m.minutes * 60000) : null;
                    return (
                      <div key={i} className="flex items-start justify-between gap-2">
                        <span className="font-body text-sm text-foreground">{i + 1}. {m.label}</span>
                        {achievedDate && <span className="font-body text-xs text-muted-foreground whitespace-nowrap">{formatDateDDMMYYYY(achievedDate)}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Export */}
            <button
              onClick={handleExport}
              className="w-full h-[52px] bg-primary text-primary-foreground font-heading text-[15px] font-semibold rounded-[14px] active:scale-[0.97] active:bg-primary-dark transition-all duration-[120ms]"
            >
              Export Records
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default HistoryDrawer;
