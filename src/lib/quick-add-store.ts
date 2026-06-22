// Tiny event bus + persistence for Quick-Add modals
export type QuickAddType = "lead" | "followup" | "visit" | "call" | "task";

const EVT = "aiddybiz:quick-add";

export function openQuickAdd(type: QuickAddType) {
  window.dispatchEvent(new CustomEvent<QuickAddType>(EVT, { detail: type }));
}

export function onQuickAdd(handler: (type: QuickAddType) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<QuickAddType>).detail);
  window.addEventListener(EVT, listener);
  return () => window.removeEventListener(EVT, listener);
}

const SEARCH_EVT = "aiddybiz:global-search";
export function openGlobalSearch() {
  window.dispatchEvent(new CustomEvent(SEARCH_EVT));
}
export function onGlobalSearch(handler: () => void) {
  const listener = () => handler();
  window.addEventListener(SEARCH_EVT, listener);
  return () => window.removeEventListener(SEARCH_EVT, listener);
}

/* ---------- Persistence (localStorage) ---------- */
const STORE_KEY = "aiddybiz:entries";
export type QuickAddEntry = {
  id: string;
  type: QuickAddType;
  data: Record<string, string>;
  createdAt: string;
};

export function saveQuickAddEntry(type: QuickAddType, data: Record<string, string>): QuickAddEntry {
  const entry: QuickAddEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    data,
    createdAt: new Date().toISOString(),
  };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const list: QuickAddEntry[] = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 200)));
    window.dispatchEvent(new CustomEvent("aiddybiz:entry-saved", { detail: entry }));
  } catch {
    /* ignore quota errors */
  }
  return entry;
}

export function getQuickAddEntries(type?: QuickAddType): QuickAddEntry[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const list: QuickAddEntry[] = raw ? JSON.parse(raw) : [];
    return type ? list.filter((e) => e.type === type) : list;
  } catch {
    return [];
  }
}
