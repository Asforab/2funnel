import { db } from "@/lib/db";

interface NotificationsPanelProps {
  agencyId: string;
}

export async function NotificationsPanel({ agencyId }: NotificationsPanelProps) {
  const notifications = await db.notification.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      User: {
        select: {
          name: true,
          avatarUrl: true
        }
      }
    }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Notificações Recentes</h2>
      
      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <img 
                  src={notification.User.avatarUrl} 
                  alt={notification.User.name}
                  className="w-6 h-6 rounded-full"
                />
                <p className="text-sm">{notification.notification}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhuma notificação recente
        </p>
      )}
    </div>
  );
}