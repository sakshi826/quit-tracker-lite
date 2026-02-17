import { WithdrawalLog } from "./types";

const QUIT_DATE_KEY = "quitDate";
const QUIT_DATE_SET_KEY = "quitDateSet";
const LOGS_KEY = "withdrawalLogs";

export function getQuitDate(): string | null {
  return localStorage.getItem(QUIT_DATE_KEY);
}

export function setQuitDate(date: string) {
  localStorage.setItem(QUIT_DATE_KEY, date);
  localStorage.setItem(QUIT_DATE_SET_KEY, "true");
}

export function isQuitDateSet(): boolean {
  return localStorage.getItem(QUIT_DATE_SET_KEY) === "true";
}

export function getLogs(): WithdrawalLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLogs(logs: WithdrawalLog[]) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function addLog(log: WithdrawalLog) {
  const logs = getLogs();
  logs.unshift(log);
  saveLogs(logs);
}

export function removeLog(id: string) {
  const logs = getLogs().filter((l) => l.id !== id);
  saveLogs(logs);
}
