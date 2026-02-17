import { useState } from "react";
import ChipGroup from "./ChipGroup";
import {
  PHYSICAL_SYMPTOMS, PSYCH_SYMPTOMS, SLEEP_SYMPTOMS, COPING_METHODS,
  getSeverityLabel, formatTimeIST, daysSince,
} from "@/lib/types";
import { addLog, getQuitDate } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface LogCardProps {
  onSaved: () => void;
}

const LogCard = ({ onSaved }: LogCardProps) => {
  const { toast } = useToast();
  const [severity, setSeverity] = useState(5);
  const [physical, setPhysical] = useState<string[]>([]);
  const [psych, setPsych] = useState<string[]>([]);
  const [sleep, setSleep] = useState<string[]>([]);
  const [coping, setCoping] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [recordTime, setRecordTime] = useState(() => new Date());
  const [editingTime, setEditingTime] = useState(false);

  const toggle = (arr: string[], setter: (v: string[]) => void, val: string) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const handleSave = () => {
    const log = {
      id: crypto.randomUUID(),
      timestamp: recordTime.toISOString(),
      severity,
      physicalSymptoms: physical,
      psychSymptoms: psych,
      sleepSymptoms: sleep,
      copingMethods: coping,
      notes,
    };
    addLog(log);
    const qd = getQuitDate();
    const dayN = qd ? daysSince(qd) : 0;
    toast({ description: `Entry saved. Day ${dayN}.` });
    // Reset
    setSeverity(5);
    setPhysical([]);
    setPsych([]);
    setSleep([]);
    setCoping([]);
    setNotes("");
    setRecordTime(new Date());
    setEditingTime(false);
    onSaved();
  };

  return (
    <div className="card-base space-y-5">
      <h2 className="section-title">Log Symptoms</h2>

      {/* Severity slider */}
      <div className="space-y-2">
        <p className="label-text">Overall severity</p>
        <input
          type="range"
          min={1}
          max={10}
          value={severity}
          onChange={(e) => setSeverity(Number(e.target.value))}
          className="w-full accent-primary h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((severity - 1) / 9) * 100}%, hsl(var(--border-light)) ${((severity - 1) / 9) * 100}%, hsl(var(--border-light)) 100%)`,
          }}
        />
        <div className="flex justify-between items-center">
          <span className="font-body text-sm text-body transition-opacity">{severity}/10 &mdash; {getSeverityLabel(severity)}</span>
        </div>
        {severity >= 8 && (
          <div className="bg-warning-light border border-warning/40 rounded-[10px] p-3">
            <p className="font-body text-[13px] text-body">
              At this severity level, a consultation with a healthcare professional is advisable. Contact your EAP helpline or a physician.
            </p>
          </div>
        )}
      </div>

      <ChipGroup label="Physical symptoms" options={PHYSICAL_SYMPTOMS} selected={physical} onToggle={(v) => toggle(physical, setPhysical, v)} />
      <ChipGroup label="Psychological symptoms" options={PSYCH_SYMPTOMS} selected={psych} onToggle={(v) => toggle(psych, setPsych, v)} />
      <ChipGroup label="Sleep-related symptoms" options={SLEEP_SYMPTOMS} selected={sleep} onToggle={(v) => toggle(sleep, setSleep, v)} />
      <ChipGroup label="Coping strategies in use" options={COPING_METHODS} selected={coping} onToggle={(v) => toggle(coping, setCoping, v)} />

      {/* Time */}
      <div className="space-y-1">
        <p className="label-text">Recorded at</p>
        <div className="flex items-center gap-2">
          {editingTime ? (
            <input
              type="datetime-local"
              value={recordTime.toISOString().slice(0, 16)}
              onChange={(e) => setRecordTime(new Date(e.target.value))}
              className="bg-surface-2 border border-border rounded-xl px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:bg-card outline-none"
            />
          ) : (
            <span className="font-body text-sm text-body">{formatTimeIST(recordTime)}</span>
          )}
          <button onClick={() => setEditingTime(!editingTime)} className="font-body text-sm text-primary">
            {editingTime ? "Done" : "Edit time"}
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <p className="label-text">Notes</p>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card outline-none transition-colors"
        />
      </div>

      <div className="border-t border-border-light pt-4">
        <button
          onClick={handleSave}
          className="w-full h-[52px] bg-primary text-primary-foreground font-heading text-[15px] font-semibold rounded-[14px] active:scale-[0.97] active:bg-primary-dark transition-all duration-[120ms]"
        >
          Save Entry
        </button>
      </div>
    </div>
  );
};

export default LogCard;
