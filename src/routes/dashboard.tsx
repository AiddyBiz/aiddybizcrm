import { createFileRoute } from "@tanstack/react-router";

import { DashboardScreen } from "@/components/dashboard-screen";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AiddyBiz CRM" }, { name: "description", content: "Your real estate pipeline at a glance." }] }),
  component: DashboardScreen,
});
