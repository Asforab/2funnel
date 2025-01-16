import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

const invitationSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role),
  agencyId: z.string()
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { email, role, agencyId } = invitationSchema.parse(body);

    // Check if user has permission to invite
    const agency = await db.agency.findUnique({
      where: { id: agencyId },
      include: {
        users: true
      }
    });

    if (!agency) {
      return new NextResponse("Agency not found", { status: 404 });
    }

    const isAuthorized = agency.users.some(u => 
      u.id === userId && 
      (u.role === Role.AGENCY_OWNER || u.role === Role.AGENCY_ADMIN)
    );

    if (!isAuthorized) {
      return new NextResponse("Not authorized to send invitations", { status: 403 });
    }

    // Check if invitation already exists
    const existingInvitation = await db.invitation.findUnique({
      where: { email }
    });

    if (existingInvitation) {
      return new NextResponse("Invitation already sent to this email", { status: 400 });
    }

    // Get agency and inviter details
    const inviter = await db.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    // Create invitation
    const invitation = await db.invitation.create({
      data: {
        email,
        role,
        agencyId,
        status: "PENDING"
      }
    });

    // Create notification
    await db.notification.create({
      data: {
        notification: `Invitation sent to ${email}`,
        agencyId,
        userId
      }
    });

    // Send invitation email
    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/accept/${invitation.id}`;
    await sendEmail(email, "invitation", {
      inviterName: inviter?.name || "An administrator",
      agencyName: agency.name,
      role,
      acceptUrl
    });

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Invitation error:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const invitationId = searchParams.get("id");

    if (!invitationId) {
      return new NextResponse("Invitation ID is required", { status: 400 });
    }

    // Get invitation
    const invitation = await db.invitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      return new NextResponse("Invitation not found", { status: 404 });
    }

    // Check if user has permission to revoke invitations
    const agency = await db.agency.findUnique({
      where: { id: invitation.agencyId },
      include: { users: true }
    });

    if (!agency) {
      return new NextResponse("Agency not found", { status: 404 });
    }

    const isAuthorized = agency.users.some((user: { id: string; role: Role }) => 
      user.id === userId && 
      (user.role === Role.AGENCY_OWNER || user.role === Role.AGENCY_ADMIN)
    );

    if (!isAuthorized) {
      return new NextResponse("Not authorized to revoke invitations", { status: 403 });
    }

    // Update invitation status
    const updatedInvitation = await db.invitation.update({
      where: { id: invitationId },
      data: { status: "REVOKED" }
    });

    // Create notification
    await db.notification.create({
      data: {
        notification: `Invitation to ${invitation.email} has been revoked`,
        agencyId: invitation.agencyId,
        userId
      }
    });

    // Send revocation email
    await sendEmail(invitation.email, "invitation-revoked", {
      agencyName: agency.name
    });

    return NextResponse.json(updatedInvitation);
  } catch (error) {
    console.error("Revoke invitation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const agencyId = searchParams.get("agencyId");

    if (!agencyId) {
      return new NextResponse("Agency ID is required", { status: 400 });
    }

    // Check if user has permission to view invitations
    const agency = await db.agency.findUnique({
      where: { id: agencyId },
      include: {
        users: true
      }
    });

    if (!agency) {
      return new NextResponse("Agency not found", { status: 404 });
    }

    const isAuthorized = agency.users.some(u => 
      u.id === userId && 
      (u.role === Role.AGENCY_OWNER || u.role === Role.AGENCY_ADMIN)
    );

    if (!isAuthorized) {
      return new NextResponse("Not authorized to view invitations", { status: 403 });
    }

    const invitations = await db.invitation.findMany({
      where: { agencyId }
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Get invitations error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
