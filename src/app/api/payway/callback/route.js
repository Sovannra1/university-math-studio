import { NextResponse } from "next/server";

/**
 * ABA PayWay Server-to-Server Callback (Webhook)
 * Configure this URL in your ABA PayWay Merchant Portal:
 *   https://your-domain.com/api/payway/callback
 *
 * When ABA PayWay sends { tran_id, apv, status, return_params },
 * status === "0" (or 0) means the payment succeeded.
 * To automatically upgrade users/{uid}.plan = "pro" server-side,
 * add Firebase Admin credentials (FIREBASE_SERVICE_ACCOUNT_JSON) and update Firestore here.
 */
export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data = {};

    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    const { tran_id: tranId, status, apv } = data;
    const isSuccess = String(status) === "0";

    return NextResponse.json({
      received: true,
      tranId: tranId || null,
      apv: apv || null,
      approved: isSuccess,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Invalid callback payload." },
      { status: 400 }
    );
  }
}
