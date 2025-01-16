import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { invitationId: string } }
) {
  try {
    const invitation = await db.invitation.findUnique({
      where: { id: params.invitationId },
      include: {
        Agency: {
          select: {
            name: true
          }
        }
      }
    });

    if (!invitation) {
      return new NextResponse("Invitation not found", { status: 404 });
    }

    return NextResponse.json({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      agencyId: invitation.agencyId,
      agencyName: invitation.Agency.name
    });
  } catch (error) {
    console.error("Verify invitation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
