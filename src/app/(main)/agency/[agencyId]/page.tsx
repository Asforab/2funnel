import { db } from "@/lib/db";
import { MetricsSummary } from "./components/MetricsSummary";
import { SubAccountsList } from "./components/SubAccountsList";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { redirect } from "next/navigation";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

interface AgencyDashboardProps {
  params: { agencyId: string }
}

export default async function AgencyDashboard({ params }: AgencyDashboardProps) {
  const agency = await db.agency.findUnique({
    where: { id: params.agencyId },
    include: {
      users: true,
      SubAccount: true,
      Notification: true
    }
  });

  if (!agency) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {agency.name} Dashboard
        </h1>
        
        <MetricsSummary agencyId={params.agencyId} />
        
        <div className="grid gap-4 md:grid-cols-2">
          <SubAccountsList agencyId={params.agencyId} />
          <NotificationsPanel agencyId={params.agencyId} />
        </div>
      </div>
    </div>
  );
}