import { createFileRoute } from "@tanstack/react-router";

import { DashboardScreen } from "@/components/dashboard-screen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AiddyBiz CRM" },
      { name: "description", content: "Your real estate CRM dashboard for leads, follow-ups and deals." },
    ],
  }),
  component: DashboardScreen,
});
