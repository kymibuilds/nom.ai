"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(credits: number) {
  // Edge-case: invalid credits
  if (!credits || credits <= 0) {
    throw new Error("Invalid credit amount");
  }

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_APP_URL");

  // Calculate amount safely
  const amount = Math.round((credits / 50) * 100);
  if (amount < 20) throw new Error("Amount too low for Stripe minimum charge");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], // amazon_pay removed — not supported in Checkout
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${credits} biscuits`,
          },
          unit_amount: amount, // value in cents
        },
        quantity: 1,
      },
    ],

    customer_creation: "always",

    success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/billing/cancel`,

    client_reference_id: userId,

    metadata: {
      credits: String(credits),
      userId,
    },
  });

  if (!session.url) throw new Error("Stripe session URL missing");

  return redirect(session.url);
}
