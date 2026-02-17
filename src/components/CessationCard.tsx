import { useState, useEffect } from "react";
import { formatDateDDMMYYYY, daysSince } from "@/lib/types";
import { getQuitDate, setQuitDate, isQuitDateSet } from "@/lib/storage";

interface CessationCardProps {
  onDateChange: () => void;
}

const CessationCard = ({ onDateChange }: CessationCardProps) => {
  const [expanded, setExpanded] = useState(!isQuitDateSet());
  const [dateValue, setDateValue] = useState(() => {
    const q = getQuitDate();
    return q ? q.slice(0, 10) : new Date().toISOString().slice(0, 10);
  });
  const [savedDate, setSavedDate] = useState(getQuitDate());

  useEffect(() => {
    if (!isQuitDateSet()) setExpanded(true);
  }, []);

  const handleSave = () => {
    setQuitDate(dateValue);
    setSavedDate(dateValue);
    setExpanded(false);
    onDateChange();
  };

  const days = savedDate ? daysSince(savedDate) : 0;
  const isFuture = days < 0;

  const timeSinceStr = () => {
    if (!savedDate) return "";
    const ms = Date.now() - new Date(savedDate).getTime();
    if (ms < 0) return "";
    const totalHrs = Math.floor(ms / (1000 * 60 * 60));
    const d = Math.floor(totalHrs / 24);
    const h = totalHrs % 24;
    return `${d} days, ${h} hrs`;
  };

  return (
    <div className="space-y-3">
      {/* Collapsed */}
      {!expanded && savedDate && (
        <div className="bg-card border border-border rounded-2xl px-4 py-3.5 flex items-center justify-between">
          <span className="font-body text-sm text-muted-foreground">
            Cessation date: {formatDateDDMMYYYY(new Date(savedDate))}
          </span>
          <button onClick={() => setExpanded(true)} className="font-body text-sm text-primary font-medium">
            Edit
          </button>
        </div>
      )}

      {/* Status banner */}
      {!expanded && savedDate && (
        <div className="bg-primary-light border border-primary/40 rounded-2xl py-4 px-5 text-center">
          {isFuture ? (
            <p className="font-heading text-lg font-bold text-primary-dark">
              Cessation begins in {Math.abs(days)} days.
            </p>
          ) : (
            <>
              <p className="font-heading text-2xl font-bold text-primary-dark">
                Day {days} without tobacco
              </p>
              <p className="font-body text-[13px] text-muted-foreground mt-1">
                Since {formatDateDDMMYYYY(new Date(savedDate))} &middot; {timeSinceStr()}
              </p>
            </>
          )}
        </div>
      )}

      {/* Expanded */}
      {expanded && (
        <div className="card-base space-y-4">
          <div>
            <h2 className="section-title">Cessation Date</h2>
            <p className="label-text mt-1">Your quit date is used to calculate recovery milestones.</p>
          </div>
          <div className="space-y-1.5">
            <label className="label-text">Date of last cigarette</label>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:bg-card outline-none transition-colors"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full h-[52px] bg-primary text-primary-foreground font-heading text-[15px] font-semibold rounded-[14px] active:scale-[0.97] active:bg-primary-dark transition-all duration-[120ms]"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default CessationCard;
