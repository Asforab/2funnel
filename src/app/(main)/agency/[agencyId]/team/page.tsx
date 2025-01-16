import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

interface TeamManagementProps {
  params: { agencyId: string }
}

export default async function TeamManagement({ params }: TeamManagementProps) {
  const teamMembers = await db.user.findMany({
    where: { agencyId: params.agencyId },
    orderBy: { createdAt: "desc" }
  });

  if (!teamMembers) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Team Management
        </h1>
        
        {/* TODO: Add team management components */}
      </div>
    </div>
  );
}