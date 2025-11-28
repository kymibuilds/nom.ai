// api/webhook/stripe

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/server/db"; // adjust to your prisma client path

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

// IMPORTANT: raw body required for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle successful checkout session
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.client_reference_id;
    const credits = Number(session.metadata?.credits ?? 0);

    if (!userId || !credits) {
      return NextResponse.json({ message: "Missing user/credits" });
    }

    // Create Stripe transaction record
    await db.stripeTransaction.create({
      data: {
        userId,
        credits,
      },
    });

    // Add credits to user
    await db.user.update({
      where: { id: userId },
      data: {
        credits: { increment: credits },
      },
    });
  }

  return NextResponse.json({ received: true });
}
