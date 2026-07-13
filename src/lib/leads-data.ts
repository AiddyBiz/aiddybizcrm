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
  assignedTo?: string;
};

const H = 3600 * 1000;

export const LEADS: Lead[] = [
  { id: "1", name: "Ananya Sharma", phone: "+919812345612", email: "ananya.sharma@example.com", project: "Sunrise Towers", budget: "1.8–2.2 Cr", stage: "Qualified", score: 92, hot: true, source: "Facebook Lead", campaign: "Sunrise Towers Premium Apartments", propertyType: "3 BHK Apartment", status: "CONTACTED", createdAt: new Date(Date.now() - 2 * H).toISOString(), pipelineStatus: "Interested", assignedTo: "Rahul Verma" },
  { id: "2", name: "Rohan Mehta", phone: "+919876543244", email: "rohan.mehta@example.com", project: "Sobha Dream Acres", budget: "85L–1.1 Cr", stage: "New", score: 78, hot: true, source: "Google Ads", campaign: "Sobha Dream Acres Launch", propertyType: "2 BHK Apartment", status: "UNCONTACTED", createdAt: new Date(Date.now() - 5 * H).toISOString(), pipelineStatus: "Call Connected", assignedTo: "Priya Nair" },
  { id: "3", name: "Kavya Iyer", phone: "+919001234508", email: "kavya.iyer@example.com", project: "Brigade Cornerstone", budget: "2.5–3 Cr", stage: "Visit", score: 81, hot: false, source: "Channel Partner", campaign: "Brigade Cornerstone Villas", propertyType: "Villa", status: "INTERESTED", createdAt: new Date(Date.now() - 26 * H).toISOString(), pipelineStatus: "Site Visit Scheduled", assignedTo: "Rahul Verma" },
  { id: "4", name: "Karthik Reddy", phone: "+918812345691", email: "karthik.reddy@example.com", project: "Godrej Splendour", budget: "70–90L", stage: "New", score: 64, hot: false, source: "Website", campaign: "Godrej Splendour Phase 2", propertyType: "2 BHK Apartment", status: "UNCONTACTED", createdAt: new Date(Date.now() - 3 * H).toISOString(), pipelineStatus: "New Lead", assignedTo: "Aditya Rao" },
  { id: "5", name: "Priya Nair", phone: "+918012345633", email: "priya.nair@example.com", project: "Sunrise Towers", budget: "1.4–1.6 Cr", stage: "Negotiation", score: 88, hot: true, source: "Referral", campaign: "Sunrise Towers Premium Apartments", propertyType: "3 BHK Apartment", status: "THINKING", createdAt: new Date(Date.now() - 48 * H).toISOString(), pipelineStatus: "Negotiation", assignedTo: "Priya Nair" },
  { id: "6", name: "Vikram Singh", phone: "+917012345617", email: "vikram.singh@example.com", project: "Embassy Edge", budget: "60–75L", stage: "New", score: 52, hot: false, source: "Facebook Lead", campaign: "Embassy Edge Plots", propertyType: "Residential Plot", status: "UNCONTACTED", createdAt: new Date(Date.now() - 1 * H).toISOString(), pipelineStatus: "Call Not Connected", assignedTo: "Meera Kapoor" },
  { id: "7", name: "Sneha Patel", phone: "+919867123344", email: "sneha.patel@example.com", project: "Aiddy Green Acres", budget: "45–60L", stage: "Qualified", score: 74, hot: false, source: "Google Ads", campaign: "Green Acres Plotting", propertyType: "Residential Plot", status: "CONTACTED", createdAt: new Date(Date.now() - 8 * H).toISOString(), pipelineStatus: "Brochure Sent", assignedTo: "Rahul Verma" },
  { id: "8", name: "Arjun Malhotra", phone: "+919845112233", email: "arjun.malhotra@example.com", project: "Lakeview Township", budget: "1.6–2.0 Cr", stage: "Visit", score: 85, hot: true, source: "Referral", campaign: "Lakeview Villas", propertyType: "Villa", status: "INTERESTED", createdAt: new Date(Date.now() - 30 * H).toISOString(), pipelineStatus: "Site Visit Done", assignedTo: "Aditya Rao" },
  { id: "9", name: "Divya Menon", phone: "+919776554433", email: "divya.menon@example.com", project: "Skyline Residences", budget: "80L–1.2 Cr", stage: "New", score: 60, hot: false, source: "Website", campaign: "Skyline Launch", propertyType: "2 BHK Apartment", status: "UNCONTACTED", createdAt: new Date(Date.now() - 6 * H).toISOString(), pipelineStatus: "New Lead", assignedTo: "Meera Kapoor" },
  { id: "10", name: "Manish Gupta", phone: "+919712233445", email: "manish.gupta@example.com", project: "Sunrise Towers", budget: "2.0–2.4 Cr", stage: "Negotiation", score: 90, hot: true, source: "Channel Partner", campaign: "Sunrise Towers Premium Apartments", propertyType: "3 BHK Apartment", status: "THINKING", createdAt: new Date(Date.now() - 72 * H).toISOString(), pipelineStatus: "Negotiation", assignedTo: "Priya Nair" },
  { id: "11", name: "Neha Joshi", phone: "+918899223344", email: "neha.joshi@example.com", project: "Palm Farmhouses", budget: "75L–1.0 Cr", stage: "Qualified", score: 70, hot: false, source: "Facebook Lead", campaign: "Palm Farmhouses", propertyType: "Farmhouse", status: "CONTACTED", createdAt: new Date(Date.now() - 12 * H).toISOString(), pipelineStatus: "Interested", assignedTo: "Rahul Verma" },
  { id: "12", name: "Rahul Bhatia", phone: "+919911223399", email: "rahul.bhatia@example.com", project: "Sunrise Villas", budget: "3.0–3.8 Cr", stage: "Visit", score: 82, hot: false, source: "Website", campaign: "Sunrise Villas Whitefield", propertyType: "Villa", status: "INTERESTED", createdAt: new Date(Date.now() - 22 * H).toISOString(), pipelineStatus: "Site Visit Scheduled", assignedTo: "Aditya Rao" },
  { id: "13", name: "Isha Kulkarni", phone: "+917788990011", email: "isha.kulkarni@example.com", project: "Aiddy Green Acres", budget: "50–70L", stage: "Closed", score: 95, hot: true, source: "Referral", campaign: "Green Acres Plotting", propertyType: "Residential Plot", status: "BOOKED", createdAt: new Date(Date.now() - 120 * H).toISOString(), pipelineStatus: "Booking", assignedTo: "Priya Nair" },
  { id: "14", name: "Suresh Kumar", phone: "+919888112233", email: "suresh.kumar@example.com", project: "Embassy Edge", budget: "55–70L", stage: "New", score: 48, hot: false, source: "Google Ads", campaign: "Embassy Edge Plots", propertyType: "Residential Plot", status: "UNCONTACTED", createdAt: new Date(Date.now() - 4 * H).toISOString(), pipelineStatus: "Call Not Connected", assignedTo: "Meera Kapoor" },
  { id: "15", name: "Pooja Deshmukh", phone: "+919944556677", email: "pooja.deshmukh@example.com", project: "Skyline Residences", budget: "1.1–1.3 Cr", stage: "Qualified", score: 76, hot: false, source: "Facebook Lead", campaign: "Skyline Launch", propertyType: "3 BHK Apartment", status: "CONTACTED", createdAt: new Date(Date.now() - 18 * H).toISOString(), pipelineStatus: "Call Back", assignedTo: "Rahul Verma" },
  { id: "16", name: "Aditya Rao", phone: "+919812233445", email: "aditya.rao@example.com", project: "Lakeview Township", budget: "1.8–2.2 Cr", stage: "Visit", score: 86, hot: true, source: "Channel Partner", campaign: "Lakeview Villas", propertyType: "Villa", status: "INTERESTED", createdAt: new Date(Date.now() - 40 * H).toISOString(), pipelineStatus: "Site Visit Done", assignedTo: "Aditya Rao" },
  { id: "17", name: "Meera Kapoor", phone: "+919933112244", email: "meera.kapoor@example.com", project: "Sunrise Towers", budget: "1.5–1.8 Cr", stage: "Negotiation", score: 84, hot: true, source: "Referral", campaign: "Sunrise Towers Premium Apartments", propertyType: "3 BHK Apartment", status: "THINKING", createdAt: new Date(Date.now() - 96 * H).toISOString(), pipelineStatus: "Negotiation", assignedTo: "Priya Nair" },
  { id: "18", name: "Rajesh Khanna", phone: "+919876001122", email: "rajesh.khanna@example.com", project: "Godrej Splendour", budget: "80L–1.0 Cr", stage: "New", score: 55, hot: false, source: "Website", campaign: "Godrej Splendour Phase 2", propertyType: "2 BHK Apartment", status: "UNCONTACTED", createdAt: new Date(Date.now() - 7 * H).toISOString(), pipelineStatus: "New Lead", assignedTo: "Meera Kapoor" },
  { id: "19", name: "Tanvi Shah", phone: "+919812009988", email: "tanvi.shah@example.com", project: "Palm Farmhouses", budget: "90L–1.2 Cr", stage: "Qualified", score: 79, hot: false, source: "Google Ads", campaign: "Palm Farmhouses", propertyType: "Farmhouse", status: "CONTACTED", createdAt: new Date(Date.now() - 14 * H).toISOString(), pipelineStatus: "Interested", assignedTo: "Rahul Verma" },
  { id: "20", name: "Sandeep Yadav", phone: "+919812776655", email: "sandeep.yadav@example.com", project: "Brigade Cornerstone", budget: "2.2–2.8 Cr", stage: "Visit", score: 83, hot: false, source: "Channel Partner", campaign: "Brigade Cornerstone Villas", propertyType: "Villa", status: "INTERESTED", createdAt: new Date(Date.now() - 34 * H).toISOString(), pipelineStatus: "Site Visit Scheduled", assignedTo: "Aditya Rao" },
  { id: "21", name: "Nisha Agarwal", phone: "+919812445566", email: "nisha.agarwal@example.com", project: "Aiddy Green Acres", budget: "45–60L", stage: "Closed", score: 93, hot: true, source: "Referral", campaign: "Green Acres Plotting", propertyType: "Residential Plot", status: "BOOKED", createdAt: new Date(Date.now() - 150 * H).toISOString(), pipelineStatus: "Closure", assignedTo: "Priya Nair" },
  { id: "22", name: "Kiran Joshi", phone: "+919812009911", email: "kiran.joshi@example.com", project: "Sunrise Towers", budget: "1.6–2.0 Cr", stage: "Qualified", score: 72, hot: false, source: "Facebook Lead", campaign: "Sunrise Towers Premium Apartments", propertyType: "3 BHK Apartment", status: "CONTACTED", createdAt: new Date(Date.now() - 20 * H).toISOString(), pipelineStatus: "Brochure Sent", assignedTo: "Rahul Verma" },
  { id: "23", name: "Deepak Sinha", phone: "+919812334455", email: "deepak.sinha@example.com", project: "Skyline Residences", budget: "95L–1.2 Cr", stage: "New", score: 58, hot: false, source: "Website", campaign: "Skyline Launch", propertyType: "2 BHK Apartment", status: "UNCONTACTED", createdAt: new Date(Date.now() - 9 * H).toISOString(), pipelineStatus: "Call Connected", assignedTo: "Meera Kapoor" },
  { id: "24", name: "Ritika Bansal", phone: "+919812667788", email: "ritika.bansal@example.com", project: "Lakeview Township", budget: "1.4–1.6 Cr", stage: "Negotiation", score: 87, hot: true, source: "Referral", campaign: "Lakeview Villas", propertyType: "Villa", status: "THINKING", createdAt: new Date(Date.now() - 60 * H).toISOString(), pipelineStatus: "Negotiation", assignedTo: "Aditya Rao" },
];

export function getLead(id: string): Lead | undefined {
  return LEADS.find((l) => l.id === id);
}
