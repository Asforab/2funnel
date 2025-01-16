import { db } from "@/lib/db";

interface Metrics {
  subaccounts: number;
  users: number;
  notifications: number;
}

interface MetricsSummaryProps {
  agencyId: string;
}

export async function MetricsSummary({ agencyId }: MetricsSummaryProps) {
  const metrics = await db.$queryRaw<Metrics[]>`
    SELECT 
      COUNT(DISTINCT s.id) as subaccounts,
      COUNT(DISTINCT u.id) as users,
      COUNT(DISTINCT n.id) as notifications
    FROM "Agency" a
    LEFT JOIN "SubAccount" s ON s."agencyId" = a.id
    LEFT JOIN "User" u ON u."agencyId" = a.id
    LEFT JOIN "Notification" n ON n."agencyId" = a.id
    WHERE a.id = ${agencyId}
  `;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="p-6 border rounded-lg">
        <h3 className="text-sm font-medium">Subcontas</h3>
        <p className="text-2xl font-bold">{metrics[0].subaccounts}</p>
      </div>
      <div className="p-6 border rounded-lg">
        <h3 className="text-sm font-medium">Usuários</h3>
        <p className="text-2xl font-bold">{metrics[0].users}</p>
      </div>
      <div className="p-6 border rounded-lg">
        <h3 className="text-sm font-medium">Notificações</h3>
        <p className="text-2xl font-bold">{metrics[0].notifications}</p>
      </div>
    </div>
  );
}