import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { ok: false, error: "Razorpay is not configured." },
      { status: 503 }
    );
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    return NextResponse.json({ ok: expected === razorpay_signature });
  } catch {
    return NextResponse.json({ ok: false, error: "Verification error." }, {
      status: 400,
    });
  }
}
