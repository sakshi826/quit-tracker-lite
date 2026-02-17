import { useState, useCallback } from "react";
import TopBar from "@/components/TopBar";
import CessationCard from "@/components/CessationCard";
import LogCard from "@/components/LogCard";
import RecoveryTimeline from "@/components/RecoveryTimeline";
import TodaySnapshot from "@/components/TodaySnapshot";
import RecentEntries from "@/components/RecentEntries";
import HistoryDrawer from "@/components/HistoryDrawer";
import { getLogs } from "@/lib/storage";

const Index = () => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const logs = getLogs();

  return (
    <div className="min-h-screen bg-background">
      <TopBar onOpenHistory={() => setHistoryOpen(true)} />

      <main className="max-w-[430px] mx-auto px-4 py-4 pb-20 space-y-3" key={refreshKey}>
        <CessationCard onDateChange={refresh} />
        <LogCard onSaved={refresh} />
        <TodaySnapshot logs={logs} />
        <RecoveryTimeline />
        <RecentEntries logs={logs} onOpenHistory={() => setHistoryOpen(true)} onChanged={refresh} />
      </main>

      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} logs={logs} onChanged={refresh} />
    </div>
  );
};

export default Index;
