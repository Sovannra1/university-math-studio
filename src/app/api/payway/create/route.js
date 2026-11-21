import { NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * ABA PayWay Purchase API Route
 * To enable automatic ABA PayWay checkout, set in .env.local / Vercel:
 *   ABA_PAYWAY_MERCHANT_ID=your_merchant_id
 *   ABA_PAYWAY_API_KEY=your_api_key
 *   ABA_PAYWAY_API_URL=https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      uid,
      email,
      name,
      amount = 5,
      purchaseType = "all-pro",
      subjectId = null,
    } = body || {};

    if (!uid || !email) {
      return NextResponse.json(
        { error: "Missing user identity (uid/email)." },
        { status: 400 }
      );
    }

    const tranId = `UMS-${Date.now()}-${String(uid).slice(0, 6)}`;
    const merchantId = process.env.ABA_PAYWAY_MERCHANT_ID;
    const apiKey = process.env.ABA_PAYWAY_API_KEY;
    const checkoutUrl =
      process.env.ABA_PAYWAY_API_URL ||
      "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";

    if (!merchantId || !apiKey) {
      return NextResponse.json({
        configured: false,
        mode: "manual-aba-qr",
        tranId,
        amount: Number(amount),
        purchaseType,
        subjectId,
        message:
          "ABA PayWay Merchant API keys are not configured yet; using ABA QR / transaction reference mode.",
      });
    }

    const reqTime = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);
    const amountStr = Number(amount).toFixed(2);
    const firstname = (name || "Student").split(" ")[0];
    const lastname = (name || "User").split(" ").slice(1).join(" ") || "UMS";
    const paymentOption = "abapay_khqr";
    const origin = request.headers.get("origin") || "";
    const returnUrl = Buffer.from(`${origin}/?payment=success&tran=${tranId}`).toString("base64");
    const continueSuccessUrl = `${origin}/?payment=success&tran=${tranId}`;
    const customFields = Buffer.from(
      JSON.stringify({ uid, email, purchaseType, subjectId })
    ).toString("base64");

    // Standard ABA PayWay HMAC-SHA512 hash concatenation order
    const hashString =
      reqTime +
      merchantId +
      tranId +
      amountStr +
      "" + // items
      "" + // shipping
      firstname +
      lastname +
      email +
      "" + // phone
      "purchase" +
      paymentOption +
      returnUrl +
      "" + // cancel_url
      continueSuccessUrl +
      "" + // return_deeplink
      "USD" +
      customFields;

    const hash = crypto
      .createHmac("sha512", apiKey)
      .update(hashString)
      .digest("base64");

    return NextResponse.json({
      configured: true,
      mode: "aba-payway-auto",
      checkoutUrl,
      payload: {
        req_time: reqTime,
        merchant_id: merchantId,
        tran_id: tranId,
        amount: amountStr,
        firstname,
        lastname,
        email,
        type: "purchase",
        payment_option: paymentOption,
        return_url: returnUrl,
        continue_success_url: continueSuccessUrl,
        currency: "USD",
        custom_fields: customFields,
        hash,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Failed to initialize ABA payment." },
      { status: 500 }
    );
  }
}
