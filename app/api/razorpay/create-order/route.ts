import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const keyId =
    process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay is not configured. Add your API keys to .env.local." },
      { status: 503 }
    );
  }

  try {
    const { amount, receipt } = await req.json();
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const Razorpay = (await import("razorpay")).default;
    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await instance.orders.create({
      amount: Math.round(amount * 100), // ₹ → paise
      currency: "INR",
      receipt: String(receipt ?? `rcpt_${Date.now()}`),
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay create-order failed:", err);
    return NextResponse.json(
      { error: "Could not create the payment order." },
      { status: 500 }
    );
  }
}
