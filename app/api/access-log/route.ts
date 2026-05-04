import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase-admin";

function limparIp(valor: string) {
  return valor.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { path, referrer, userAgent } = body;

    const ip = limparIp(
      req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );

    let city = "";
    let region = "";
    let country = "";

    if (ip !== "unknown" && ip !== "::1" && ip !== "127.0.0.1") {
      try {
        const geo = await fetch(`https://ipapi.co/${ip}/json/`, {
          cache: "no-store",
        });

        const geoData = await geo.json();

        city = geoData.city || "";
        region = geoData.region || "";
        country = geoData.country_name || "";
      } catch {
        city = "";
        region = "";
        country = "";
      }
    }

    await supabaseAdmin.from("am_access_logs").insert({
      path: path || "/",
      referrer: referrer || "",
      user_agent: userAgent || "",
      ip,
      city,
      region,
      country,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
