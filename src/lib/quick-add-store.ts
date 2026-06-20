// Tiny event bus for opening Quick-Add modals from anywhere
export type QuickAddType = "lead" | "followup" | "visit" | "deal" | "task";

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
