import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get("From")?.toString();
    const body = formData.get("Body")?.toString();
    const messageSid = formData.get("MessageSid")?.toString();

    console.log(`[Twilio Webhook] Inbound SMS from ${from}: "${body}" (SID: ${messageSid})`);

    // Basic TwiML response
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thank you for contacting Land Intelligence OS Acquisitions. A representative will review your message shortly.</Message>
</Response>`;

    return new NextResponse(twimlResponse, {
      status: 200,
      headers: { "Content-Type": "text/xml" }
    });
  } catch (err: any) {
    console.error("[Twilio Webhook Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
