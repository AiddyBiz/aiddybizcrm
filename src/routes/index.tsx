import { createFileRoute } from "@tanstack/react-router";

import { Dashboard } from "./dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AiddyBiz CRM" },
      { name: "description", content: "Your real estate CRM dashboard for leads, follow-ups and deals." },
    ],
  }),
  component: Dashboard,
});
