import { db } from "@/lib/db";

interface SubAccountsListProps {
  agencyId: string;
}

export async function SubAccountsList({ agencyId }: SubAccountsListProps) {
  const subAccounts = await db.subAccount.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Subcontas Recentes</h2>
      
      {subAccounts.length > 0 ? (
        <div className="space-y-2">
          {subAccounts.map((subAccount) => (
            <div key={subAccount.id} className="p-4 border rounded-lg">
              <h3 className="font-medium">{subAccount.name}</h3>
              <p className="text-sm text-muted-foreground">
                Criado em: {new Date(subAccount.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhuma subconta encontrada
        </p>
      )}
    </div>
  );
}