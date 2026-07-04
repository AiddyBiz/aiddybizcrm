import { useSyncExternalStore } from "react";
import { LEADS as SEED, type Lead } from "./leads-data";

let leads: Lead[] = [...SEED];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function getLeadsSnapshot(): Lead[] {
  return leads;
}

export function getLeadById(id: string): Lead | undefined {
  return leads.find((l) => l.id === id);
}

export function addLead(lead: Lead) {
  leads = [lead, ...leads];
  emit();
}

export function updateLead(id: string, patch: Partial<Lead>) {
  leads = leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
  emit();
}

export function subscribeLeads(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useLeads(): Lead[] {
  return useSyncExternalStore(subscribeLeads, getLeadsSnapshot, getLeadsSnapshot);
}
