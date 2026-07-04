import type { PipelineStatus } from "./pipeline";

export type LeadStage = "New" | "Qualified" | "Visit" | "Negotiation" | "Closed";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  project: string;
  budget: string;
  stage: LeadStage;
  score: number;
  hot: boolean;
  source: string;
  campaign: string;
  propertyType: string;
  status: string;
  createdAt: string;
  pipelineStatus: PipelineStatus;
  lostFromStage?: PipelineStatus;
};

export const LEADS: Lead[] = [
  {
    id: "1", name: "Ananya Sharma", phone: "+919812345612", email: "ananya.sharma@example.com",
    project: "Prestige Lakeside", budget: "1.8–2.2 Cr", stage: "Qualified", score: 92, hot: true,
    source: "Facebook Lead", campaign: "Prestige Lakeside Premium Apartments",
    propertyType: "3 BHK Apartment", status: "CONTACTED",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    pipelineStatus: "Interested",
  },
  {
    id: "2", name: "Rohan Mehta", phone: "+919876543244", email: "rohan.mehta@example.com",
    project: "Sobha Dream Acres", budget: "85L–1.1 Cr", stage: "New", score: 78, hot: true,
    source: "Google Ads", campaign: "Sobha Dream Acres Launch",
    propertyType: "2 BHK Apartment", status: "UNCONTACTED",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    pipelineStatus: "Call Connected",
  },
  {
    id: "3", name: "Kavya Iyer", phone: "+919001234508", email: "kavya.iyer@example.com",
    project: "Brigade Cornerstone", budget: "2.5–3 Cr", stage: "Visit", score: 81, hot: false,
    source: "Channel Partner", campaign: "Brigade Cornerstone Villas",
    propertyType: "Villa", status: "INTERESTED",
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    pipelineStatus: "Site Visit Scheduled",
  },
  {
    id: "4", name: "Karthik Reddy", phone: "+918812345691", email: "karthik.reddy@example.com",
    project: "Godrej Splendour", budget: "70–90L", stage: "New", score: 64, hot: false,
    source: "Website", campaign: "Godrej Splendour Phase 2",
    propertyType: "2 BHK Apartment", status: "UNCONTACTED",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    pipelineStatus: "New Lead",
  },
  {
    id: "5", name: "Priya Nair", phone: "+918012345633", email: "priya.nair@example.com",
    project: "Prestige Lakeside", budget: "1.4–1.6 Cr", stage: "Negotiation", score: 88, hot: true,
    source: "Referral", campaign: "Prestige Lakeside Premium Apartments",
    propertyType: "3 BHK Apartment", status: "THINKING",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    pipelineStatus: "Negotiation",
  },
  {
    id: "6", name: "Vikram Singh", phone: "+917012345617", email: "vikram.singh@example.com",
    project: "Embassy Edge", budget: "60–75L", stage: "New", score: 52, hot: false,
    source: "Facebook Lead", campaign: "Embassy Edge Plots",
    propertyType: "Residential Plot", status: "UNCONTACTED",
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    pipelineStatus: "Call Not Connected",
  },
];

export function getLead(id: string): Lead | undefined {
  return LEADS.find((l) => l.id === id);
}
