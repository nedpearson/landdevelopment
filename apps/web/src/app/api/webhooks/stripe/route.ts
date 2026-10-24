import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // Process event types
    switch (event.type) {
      case "checkout.session.completed":
        console.log(`[Stripe Webhook] Checkout completed for session: ${event.data?.object?.id}`);
        break;
      case "customer.subscription.updated":
        console.log(`[Stripe Webhook] Subscription updated for customer: ${event.data?.object?.customer}`);
        break;
      case "invoice.payment_succeeded":
        console.log(`[Stripe Webhook] Payment succeeded for invoice: ${event.data?.object?.id}`);
        break;
      default:
        console.log(`[Stripe Webhook] Handled unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, eventId: event.id || "simulated" }, { status: 200 });
  } catch (err: any) {
    console.error("[Stripe Webhook Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
