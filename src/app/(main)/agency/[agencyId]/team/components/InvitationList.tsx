"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Role } from "@prisma/client";

interface Invitation {
  id: string;
  email: string;
  role: Role;
  status: "PENDING" | "ACCEPTED" | "REVOKED";
  createdAt: string;
}

export function InvitationList({ agencyId }: { agencyId: string }) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, [agencyId]);

  async function fetchInvitations() {
    try {
      const response = await fetch(`/api/invitation?agencyId=${agencyId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch invitations");
      }
      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      toast.error("Failed to load invitations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRevokeInvitation(invitationId: string) {
    try {
      const response = await fetch(`/api/invitation?id=${invitationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to revoke invitation");
      }

      toast.success("Invitation revoked successfully");
      fetchInvitations(); // Refresh the list
    } catch (error) {
      toast.error("Failed to revoke invitation");
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-muted animate-pulse rounded-md" />
        <div className="h-12 bg-muted animate-pulse rounded-md" />
        <div className="h-12 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No pending invitations
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pending Invitations</h2>
      <div className="divide-y">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="py-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{invitation.email}</p>
              <p className="text-sm text-muted-foreground">
                Role: {invitation.role.replace('_', ' ')}
              </p>
              <p className="text-sm text-muted-foreground">
                Sent: {new Date(invitation.createdAt).toLocaleDateString()}
              </p>
            </div>
            {invitation.status === "PENDING" && (
              <button
                onClick={() => handleRevokeInvitation(invitation.id)}
                className="text-sm text-destructive hover:text-destructive/80"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
