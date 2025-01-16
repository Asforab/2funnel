import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/lib/email";
import { Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { invitationId: string } }
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get invitation
    const invitation = await db.invitation.findUnique({
      where: { id: params.invitationId },
      include: {
        Agency: {
          select: {
            id: true,
            name: true,
            users: {
              where: {
                role: {
                  in: [Role.AGENCY_OWNER, Role.AGENCY_ADMIN]
                }
              },
              select: {
                email: true
              }
            }
          }
        }
      }
    });

    if (!invitation) {
      return new NextResponse("Invitation not found", { status: 404 });
    }

    if (invitation.status !== "PENDING") {
      return new NextResponse("Invitation is no longer valid", { status: 400 });
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify email matches invitation
    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return new NextResponse("Email mismatch", { status: 403 });
    }

    // Begin transaction
    const [updatedInvitation, _] = await db.$transaction([
      // Update invitation status
      db.invitation.update({
        where: { id: params.invitationId },
        data: { status: "ACCEPTED" }
      }),

      // Add user to agency
      db.agency.update({
        where: { id: invitation.agencyId },
        data: {
          users: {
            connect: {
              id: userId
            }
          }
        }
      })
    ]);

    // Create notification
    await db.notification.create({
      data: {
        notification: `${user.name || user.email} has joined the agency`,
        agencyId: invitation.agencyId,
        userId
      }
    });

    // Send acceptance notification emails to agency admins
    for (const admin of invitation.Agency.users) {
      await sendEmail(admin.email, "invitation-accepted", {
        userName: user.name || user.email,
        agencyName: invitation.Agency.name,
        role: invitation.role
      });
    }

    return NextResponse.json(updatedInvitation);
  } catch (error) {
    console.error("Accept invitation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
