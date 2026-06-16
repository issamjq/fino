import { NextResponse } from "next/server";

/**
 * Receives a contact-us submission from the site and forwards it to the mjqapp
 * manager (stored under this brand). The read/write key stays server-side.
 */
export const dynamic = "force-dynamic";

const API = process.env.MJQAPP_API_URL;
const KEY = process.env.MJQAPP_READ_KEY;
const BRAND = process.env.MJQAPP_BRAND || "fino";

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  // basic length guards against abuse
  if (name.length > 200 || email.length > 200 || phone.length > 60 || message.length > 5000) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  if (!API || !KEY) {
    console.error("contact: MJQAPP_API_URL/READ_KEY not configured");
    return NextResponse.json({ error: "Contact is not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${API}/api/submissions`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": KEY },
      body: JSON.stringify({ brand: BRAND, name, email, phone, message }),
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Could not send" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }
}
