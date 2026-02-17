import { HeartPulse, BarChart2 } from "lucide-react";

interface TopBarProps {
  onOpenHistory: () => void;
}

const TopBar = ({ onOpenHistory }: TopBarProps) => (
  <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-card border-b border-border-light" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
    <div className="flex items-center gap-2">
      <HeartPulse size={18} className="text-primary" />
      <span className="font-heading text-[17px] font-bold text-foreground">Withdrawal Tracker</span>
    </div>
    <button onClick={onOpenHistory} className="p-2 -mr-2 active:scale-95 transition-transform" aria-label="History">
      <BarChart2 size={20} className="text-primary" />
    </button>
  </header>
);

export default TopBar;
