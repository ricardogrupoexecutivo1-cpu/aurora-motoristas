import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { path, referrer, userAgent } = body;

    await supabaseAdmin.from("am_access_logs").insert({
      path: path || "/",
      referrer: referrer || "",
      user_agent: userAgent || "",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: true });
  }
}
