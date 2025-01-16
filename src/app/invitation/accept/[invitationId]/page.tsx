"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface InvitationData {
  id: string;
  email: string;
  role: string;
  agencyId: string;
  status: "PENDING" | "ACCEPTED" | "REVOKED";
}

export default function AcceptInvitationPage({
  params
}: {
  params: { invitationId: string }
}) {
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userId, isSignedIn } = useAuth();

  useEffect(() => {
    fetchInvitation();
  }, [params.invitationId]);

  async function fetchInvitation() {
    try {
      const response = await fetch(`/api/invitation/verify/${params.invitationId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch invitation");
      }
      const data = await response.json();
      setInvitation(data);
    } catch (error) {
      toast.error("Invalid or expired invitation");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptInvitation() {
    if (!invitation) return;

    try {
      const response = await fetch(`/api/invitation/accept/${params.invitationId}`, {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Failed to accept invitation");
      }

      toast.success("Invitation accepted successfully");
      router.push(`/agency/${invitation.agencyId}`);
    } catch (error) {
      toast.error("Failed to accept invitation");
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Loading invitation...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Invalid Invitation</h1>
          <p className="text-muted-foreground mb-4">
            This invitation may have expired or been revoked.
          </p>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  if (invitation.status !== "PENDING") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            {invitation.status === "ACCEPTED"
              ? "Invitation Already Accepted"
              : "Invitation Revoked"}
          </h1>
          <p className="text-muted-foreground mb-4">
            {invitation.status === "ACCEPTED"
              ? "You have already accepted this invitation."
              : "This invitation has been revoked."}
          </p>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Accept Invitation</h1>
        <p className="text-muted-foreground mb-6">
          You have been invited to join an agency as a {invitation.role.replace("_", " ").toLowerCase()}.
        </p>

        {!isSignedIn ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Please sign in or create an account to accept this invitation.
            </p>
            <div className="space-x-4">
              <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
              <Button onClick={() => router.push("/sign-up")} variant="outline">
                Create Account
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button onClick={handleAcceptInvitation} className="w-full">
              Accept Invitation
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
