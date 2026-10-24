import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log(`[Resend Webhook] Email event received: ${payload.type} for email ${payload.data?.email_id}`);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("[Resend Webhook Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
