import { MILESTONES, getMilestoneTimeLabel, minutesSince } from "@/lib/types";
import { getQuitDate } from "@/lib/storage";

const RecoveryTimeline = () => {
  const qd = getQuitDate();
  const elapsed = qd ? minutesSince(qd) : 0;

  // Find where current position sits
  let currentIdx = -1;
  for (let i = 0; i < MILESTONES.length; i++) {
    if (elapsed >= MILESTONES[i].minutes) currentIdx = i;
  }

  const daysUntil = (mins: number) => {
    const diff = mins - elapsed;
    if (diff <= 0) return "";
    if (diff < 60) return `In ${diff} min`;
    if (diff < 1440) return `In ${Math.ceil(diff / 60)} hrs`;
    return `In ${Math.ceil(diff / 1440)} days`;
  };

  return (
    <div className="card-base space-y-3">
      <div>
        <h2 className="section-title">Recovery Timeline</h2>
        <p className="label-text mt-0.5">Source: NHS Stop Smoking, ICMR.</p>
      </div>

      <div className="relative pl-6">
        {/* Rail */}
        <div className="absolute left-[3px] top-1 bottom-1 w-0.5 bg-border" />

        {MILESTONES.map((m, i) => {
          const reached = elapsed >= m.minutes;
          const isCurrent = i === currentIdx;

          return (
            <div key={i} className="relative flex items-start py-2.5 gap-3">
              {/* Dot */}
              <div className="absolute -left-6 top-3 flex items-center justify-center">
                {isCurrent ? (
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-primary-light border-2 border-primary z-10 relative" />
                    <div className="absolute inset-0 w-3 h-3 rounded-full border-2 border-primary animate-pulse-ring" />
                  </div>
                ) : (
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      reached ? "bg-success" : "bg-card border-2 border-border"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex items-start justify-between gap-2 min-w-0">
                <p className={`font-body text-sm ${reached ? "text-foreground" : "text-muted-foreground"}`}>
                  {m.label}
                </p>
                <span className={`font-body text-xs whitespace-nowrap flex-shrink-0 ${reached ? "text-primary" : "text-muted-foreground"}`}>
                  {reached ? getMilestoneTimeLabel(m.minutes) : daysUntil(m.minutes)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecoveryTimeline;
