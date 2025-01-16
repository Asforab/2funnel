import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    const result = await sendEmail(
      "brenandasfora@gmail.com",
      "invitation",
      {
        inviterName: "Test User",
        agencyName: "Test Agency",
        role: "AGENCY_ADMIN",
        acceptUrl: "http://localhost:3000/invitation/accept/test-id"
      }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
