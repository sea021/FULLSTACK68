// /lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // แนะนำให้ pin apiVersion ในโปรเจกต์จริงผ่าน Stripe Dashboard
    apiVersion: "2025-07-30.basil",
});
