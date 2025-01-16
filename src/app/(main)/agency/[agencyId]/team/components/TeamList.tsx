import { db } from "@/lib/db";

interface TeamListProps {
  agencyId: string;
}

export async function TeamList({ agencyId }: TeamListProps) {
  const teamMembers = await db.user.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
    include: {
      Permissions: true
    }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Team Members</h2>
      
      {teamMembers.length > 0 ? (
        <div className="space-y-2">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <img 
                  src={member.avatarUrl} 
                  alt={member.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {member.email} • {member.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No team members found
        </p>
      )}
    </div>
  );
}